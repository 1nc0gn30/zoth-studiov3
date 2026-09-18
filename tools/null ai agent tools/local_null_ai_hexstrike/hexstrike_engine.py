import requests
import json
import os
import subprocess

class HexStrikeEngine:
    def __init__(self):
        # In a real Zoth env, these would come from the global config or manifest
        self.hex_url = "http://127.0.0.1:8000"
        self.ai_url = "http://127.0.0.1:8080"
        self.session = requests.Session()

    def execute_and_analyze(self, tool, target):
        # Tool Mapping (Ported from HexStrike original)
        cmd_map = {
            "emailharvester": f"emailharvester -d {target}",
            "sublist3r": f"sublist3r -d {target}",
            "photon": f"photon -u http://{target} --regex",
            "nikto": f"nikto -h {target}",
            "whatweb": f"whatweb -a 3 {target}",
            "gobuster": f"gobuster dir -u http://{target} -w /usr/share/wordlists/dirb/common.txt",
            "sqlmap": f"sqlmap -u {target} --batch --banner",
            "snmpwalk": f"snmpwalk -c public -v2c {target}",
            "searchsploit": f"searchsploit {target}",
            "nmap": f"nmap -sV -sC {target}",
            "dmitry": f"dmitry -winsepf {target} -o /tmp/dmitry.txt",
            "dnsenum": f"dnsenum {target}",
            "amass": f"amass enum -d {target}",
            "fierce": f"fierce --domain {target}",
            "wapiti": f"wapiti -u http://{target} --flush-session -f txt",
            "commix": f"commix --url http://{target} --batch",
            "wpscan": f"wpscan --url http://{target} --no-update",
            "joomscan": f"joomscan -u {target}",
            "wafw00f": f"wafw00f {target}",
            "davtest": f"davtest -url http://{target}"
        }

        cmd = cmd_map.get(tool.lower(), f"{tool} {target}")

        try:
            # 1. Execute via the HexStrike Engine (if available) or Local Shell
            try:
                tool_resp = self.session.post(f"{self.hex_url}/command", json={"command": cmd}, timeout=30).json()
                output = tool_resp.get("output", tool_resp.get("stdout", "No output."))
            except:
                # Fallback to local subprocess execution if the bridge is down
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=60)
                output = result.stdout if result.stdout else result.stderr

            # 2. Analyze with LocalAI
            ai_analysis = self.ask_local_ai(tool, output)

            return {"output": output, "analysis": ai_analysis}
        except Exception as e:
            return {"error": str(e)}

    def ask_local_ai(self, tool, tool_output):
        url = f"{self.ai_url}/chat/completions"
        payload = {
            "model": "gpt-4",
            "messages": [{"role": "user", "content": f"Analyze the output of {tool} on target: {tool_output[:3000]}"}],
            "max_tokens": 1150
        }
        try:
            response = self.session.post(url, json=payload, timeout=30)
            if not response.text.strip():
                return "Intelligence Core returned an empty string."
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            return f"Intelligence Error: {str(e)}"

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 2:
        engine = HexStrikeEngine()
        print(json.dumps(engine.execute_and_analyze(sys.argv[1], sys.argv[2])))
    else:
        print(json.dumps({"error": "Usage: python hexstrike_engine.py <tool> <target>"}))
