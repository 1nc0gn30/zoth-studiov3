# Pixel-Shiba playbook

1. Probe 127.0.0.1:8787/health (fail soft).
2. Confirm vault UI talks only to loopback.
3. Audit env samples for live secrets.
4. Recommend vault layout: provider, key id, never the value in git.
5. If daemon is down, say the UI can use browser-local crypto and stop.
