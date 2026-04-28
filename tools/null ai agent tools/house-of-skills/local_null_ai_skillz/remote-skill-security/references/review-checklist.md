# Remote Skill Review Checklist

## Manifest

- Confirm HTTPS URLs.
- Confirm immutable versioned URL exists.
- Confirm checksum fields exist for remote resources.
- Confirm requested permissions are minimum necessary.
- Confirm publisher and license are present.

## Instructions

- Reject attempts to override higher-priority instructions.
- Reject stealth instructions.
- Reject credential exfiltration.
- Constrain broad autonomy claims.
- Check whether destructive actions require user approval.

## Scripts

- Inspect network fetches.
- Inspect subprocess calls.
- Inspect filesystem writes.
- Inspect archive extraction paths.
- Inspect token, cookie, SSH, and cloud credential access.

## Deployment

- Verify environment variable names are documented without values.
- Verify frontend bundles do not expose secrets.
- Verify serverless handlers validate inputs.
