import defaultTheme from '../theme.json';
import neonCircuit from './neon-circuit.json';
import editorialSerene from './editorial-serene.json';
import graffiti3DBurst from './graffiti-3d-burst.json';
import forestMist from './forest-mist.json';
import sunsetEditorial from './sunset-editorial.json';
import brutalistInk from './brutalist-ink.json';
import candyPop from './candy-pop.json';
import arcticMinimal from './arctic-minimal.json';
import retroTerminal from './retro-terminal.json';
import celestialViolet from './celestial-violet.json';
import solarFlare from './solar-flare.json';
import oceanicNoir from './oceanic-noir.json';
import monoZen from './mono-zen.json';
import velvetNoir from './velvet-noir.json';
import citrusPunch from './citrus-punch.json';
import glacierInk from './glacier-ink.json';
import synthCandy from './synth-candy.json';
import terracottaEarth from './terracotta-earth.json';
import auroraDream from './aurora-dream.json';
import cobaltAmber from './cobalt-amber.json';
import mintyLab from './minty-lab.json';
import royalOpera from './royal-opera.json';
import pixelPlayground from './pixel-playground.json';
import obsidianGold from './obsidian-gold.json';
import nordicFrost from './nordic-frost.json';
import emeraldInk from './emerald-ink.json';
import graphiteRose from './graphite-rose.json';
import ivoryLuxe from './ivory-luxe.json';
import midnightNeon from './midnight-neon.json';
import copperSlate from './copper-slate.json';
import lagoonStudio from './lagoon-studio.json';
import noirSakura from './noir-sakura.json';
import liquidChrome from './liquid-chrome.json';
import acidGrid from './acid-grid.json';
import emberCanyon from './ember-canyon.json';
import ultravioletGlass from './ultraviolet-glass.json';
import alpineCharcoal from './alpine-charcoal.json';

export const themeVariants = {
  default: defaultTheme,
  'neon-circuit': neonCircuit,
  'editorial-serene': editorialSerene,
  'graffiti-3d-burst': graffiti3DBurst,
  'forest-mist': forestMist,
  'sunset-editorial': sunsetEditorial,
  'brutalist-ink': brutalistInk,
  'candy-pop': candyPop,
  'arctic-minimal': arcticMinimal,
  'retro-terminal': retroTerminal,
  'celestial-violet': celestialViolet,
  'solar-flare': solarFlare,
  'oceanic-noir': oceanicNoir,
  'mono-zen': monoZen,
  'velvet-noir': velvetNoir,
  'citrus-punch': citrusPunch,
  'glacier-ink': glacierInk,
  'synth-candy': synthCandy,
  'terracotta-earth': terracottaEarth,
  'aurora-dream': auroraDream,
  'cobalt-amber': cobaltAmber,
  'minty-lab': mintyLab,
  'royal-opera': royalOpera,
  'pixel-playground': pixelPlayground,
  'obsidian-gold': obsidianGold,
  'nordic-frost': nordicFrost,
  'emerald-ink': emeraldInk,
  'graphite-rose': graphiteRose,
  'ivory-luxe': ivoryLuxe,
  'midnight-neon': midnightNeon,
  'copper-slate': copperSlate,
  'lagoon-studio': lagoonStudio,
  'noir-sakura': noirSakura,
  'liquid-chrome': liquidChrome,
  'acid-grid': acidGrid,
  'ember-canyon': emberCanyon,
  'ultraviolet-glass': ultravioletGlass,
  'alpine-charcoal': alpineCharcoal,
} as const;

export type ThemeVariantName = keyof typeof themeVariants;

export const defaultThemeVariantName: ThemeVariantName = 'default';
