# Hosted Agent Transformation V1 Checklist

## Must Have

- One hosted pack with clear use case.
- `manifest.json` with schema, compatibility, parameters, instructions, resources, and trust.
- Immutable versioned URL.
- Top-level `/registry.json`.
- Fetch client or documented fetch command.
- Preview step before activation.
- Security review checklist.
- Compatibility check.
- Public docs page.

## Should Have

- Checksums for all resources.
- Netlify headers and redirects.
- Changelog and deprecation policy.
- Example parameter payloads.
- Install and uninstall instructions.
- Report-abuse contact.

## Do Not Ship

- Remote code execution on fetch.
- Hidden instructions.
- Unbounded free-form permissions.
- Secrets in manifests.
- Mutable versioned releases.
