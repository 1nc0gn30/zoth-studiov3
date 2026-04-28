# Schema History

## agent-pack/v1

Baseline fields: `schema_version`, `id`, `name`, `version`, `summary`, `compatibility`, `parameters`, `instructions`, `resources`, `trust`.

## Compatibility Rule

Clients should reject unknown major versions and tolerate unknown extension fields prefixed with `x_`.
