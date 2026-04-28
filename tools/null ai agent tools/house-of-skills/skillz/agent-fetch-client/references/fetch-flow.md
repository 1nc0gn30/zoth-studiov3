# Fetch Flow

## States

1. `discovered`: Registry entry found.
2. `fetched`: Manifest downloaded to staging.
3. `validated`: Required fields and schema checked.
4. `verified`: Checksums matched.
5. `previewed`: User sees permissions and resources.
6. `installed`: Pack copied into runtime store.
7. `activated`: Agent applies pack instructions within local policy.

## Failure Handling

- Network failure: keep previous installed version.
- Validation failure: quarantine manifest.
- Checksum mismatch: reject and warn.
- Permission escalation: require explicit approval.
- Runtime incompatibility: offer compatible alternatives if listed.
