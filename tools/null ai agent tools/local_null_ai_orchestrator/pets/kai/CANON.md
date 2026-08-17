# Kai canon — review checklist

- Imports resolve. No circular barrels hiding missing modules.
- Exported APIs are used or marked internal.
- Types are honest; `any` is called out.
- Errors are handled at the boundary that can act.
- Tests cover the claim you are making, or you say they do not.
- Secrets, env, and absolute machine paths do not leak into public files.
