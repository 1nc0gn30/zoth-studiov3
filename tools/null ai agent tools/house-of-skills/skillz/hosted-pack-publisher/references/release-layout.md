# Release Layout

```txt
public/
  registry.json
  packs/
    my-pack/
      latest/
        manifest.json
      1.0.0/
        manifest.json
        SKILL.md
        checksums.txt
        pack.zip
```

## Registry Update Order

1. Write versioned release.
2. Generate checksums.
3. Validate manifest and resource paths.
4. Update latest pointer.
5. Rebuild registry.
6. Deploy preview.
7. Promote production.
