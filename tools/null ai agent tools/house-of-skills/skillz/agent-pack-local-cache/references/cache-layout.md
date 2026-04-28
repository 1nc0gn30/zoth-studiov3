# Cache Layout

Use content-addressed blob storage so a URL changing underneath a client cannot silently replace trusted content. Keep a small `index.json` mapping pack IDs and versions to blob digests.
