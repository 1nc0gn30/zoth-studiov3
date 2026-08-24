#!/usr/bin/env python3
import ssl
import os
import http.server
import socketserver
from pathlib import Path

PORT = 8443
DIRECTORY = "/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public"
SSL_DIR = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/.ssl")
CERT_FILE = SSL_DIR / "server.pem"
KEY_FILE = SSL_DIR / "server.key"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cross-Origin-Opener-Policy", "same-origin-allow-popups")
        self.send_header("Cross-Origin-Embedder-Policy", "unsafe-none")
        super().end_headers()

if __name__ == "__main__":
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile=CERT_FILE, keyfile=KEY_FILE)
    
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
        print(f"🔒 Secure HTTPS Server running on https://0.0.0.0:{PORT}")
        print(f"📁 Serving directory: {DIRECTORY}")
        httpd.serve_forever()
