# Lycan canon — defensive review

- No secrets in repo or public JSON.
- Vault binds 127.0.0.1 only.
- Hub nginx does not proxy /api to the deck.
- Forms and markdown are escaped.
- CSP is present and not `*`.
- Auth cookies are not needed on the public hub.
