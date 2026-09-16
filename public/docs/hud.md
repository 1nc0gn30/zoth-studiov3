# Cyberpunk HUD

The HUD is the **shared chrome** for every workstation: a dashboard, a left deck, a center stage, and a dock.

Open: [/studio/cyberpunk-hud.html](/studio/cyberpunk-hud.html)

## Layout

| Region | Job |
| --- | --- |
| Header | Ports, clock, themes, Omniverse search |
| Left deck | Agents, radar, tool controls, memory graph, TTY |
| Stage | Dashboard **or** the live tool (iframe) |
| Dock | DASH + every workstation + learned recents |

You land on the **dashboard**. Click a tile (or a dock tab) and the tool mounts in the stage. The HUD stays around it.

## Acclimate

Opening a tool:

- Sets `data-hud-tool` / `data-hud-cat` on the shell
- Picks a matching agent (WebGen → Hermes, Math → Grok, Vault → Lycan)
- Promotes the tool-controls card
- Remembers aspect ratio per tool

## Learn

`localStorage` key `zoth-hud-learn-v1` stores opens, dwell, errors, recents. Gold chips in the dock are learned recents.

## Self-heal

- Port chips (`:8484`, `:8788`, `:11434`) sweep every 20s
- Stage watchdog if the iframe never mounts
- **RETRY** or return to dashboard
- **HEAL** on the dashboard re-pings and retries

## Deep links

```
/studio/cyberpunk-hud.html?tool=webgen
/studio/cyberpunk-hud.html?tool=math-pillars&agent=grok
```

Standalone `/studio/webgen.html` redirects into the HUD. Add `?standalone=1` to skip.

## Files

- `public/assets/zoth-cyberpunk-hud.js` / `.css`
- `public/assets/zoth-hud-intel.js`
- `public/assets/zoth-hud-workstations.js`
- `public/assets/zoth-hud-embedded.js` (iframe + redirect)
