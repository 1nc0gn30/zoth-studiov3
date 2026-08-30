/**
 * CYBER STOIC PROTOCOL v3 - STOIC DATABASE
 * Curated Meditations of Marcus Aurelius, Epictetus, and Seneca
 * Formatted with canonical citations, thematic tags, and neural commentaries.
 */

export const STOIC_PILLARS = [
  { id: 'all', label: 'All Meditations', icon: 'zap', color: '#ffb000' },
  { id: 'citadel', label: 'Inner Citadel', icon: 'shield', color: '#00f0ff' },
  { id: 'amor-fati', label: 'Amor Fati', icon: 'flame', color: '#ff2a5f' },
  { id: 'memento-mori', label: 'Memento Mori', icon: 'clock', color: '#a855f7' },
  { id: 'dichotomy', label: 'Dichotomy of Control', icon: 'cpu', color: '#00ffa3' },
  { id: 'logos', label: 'Cosmic Logos', icon: 'globe', color: '#38bdf8' },
  { id: 'discipline', label: 'Discipline & Action', icon: 'sword', color: '#eab308' }
];

export const STOIC_QUOTES = [
  {
    id: 1,
    pillar: 'citadel',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book IV.3',
    latinRef: 'Recede in te ipsum (Retreat into thyself)',
    text: 'Men seek retreats for themselves, houses in the country, sea-shores, and mountains. Nowhere can man find a quieter or more untroubled retreat than in his own soul. Constantly then give to thyself this retreat, and renew thyself.',
    commentary: 'Your mind is an impregnable citadel. External retreats are illusions; true stillness is an engineered internal state independent of external chaos.'
  },
  {
    id: 2,
    pillar: 'amor-fati',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book V.20',
    latinRef: 'Impedimentum fit via',
    text: 'The impediment to action advances action. What stands in the way becomes the way.',
    commentary: 'Adversity is raw computational fuel. Every obstacle redirected becomes the very catalyst that accelerates your evolution.'
  },
  {
    id: 3,
    pillar: 'citadel',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book XII.26',
    latinRef: 'Omnia opinio est',
    text: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
    commentary: 'Sever the neurological link between external volatility and your internal state. Control the interpretation, control reality.'
  },
  {
    id: 4,
    pillar: 'memento-mori',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book II.11',
    latinRef: 'Memento mori',
    text: 'You could leave life right now. Let that determine what you do and say and think.',
    commentary: 'Mortality is the ultimate latency optimizer. When every cycle could be your last, trivial distractions immediately drop to zero priority.'
  },
  {
    id: 5,
    pillar: 'discipline',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book V.1',
    latinRef: 'Ad officium hominis',
    text: 'At dawn, when you have trouble getting out of bed, tell yourself: "I have to go to work — as a human being. What do I have to complain of, if I\'m going to do what I was born for?"',
    commentary: 'Overcome the inertia of comfort. Purpose is not an emotional feeling; it is an active protocol executed each morning without negotiation.'
  },
  {
    id: 6,
    pillar: 'logos',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book II.1',
    latinRef: 'Sympatheia',
    text: 'When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil. But I have seen the beauty of good, and the ugliness of evil.',
    commentary: 'Pre-compile psychological resilience. Expecting flawed human algorithms prevents runtime shock and maintains equilibrium.'
  },
  {
    id: 7,
    pillar: 'dichotomy',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book VIII.47',
    latinRef: 'De exterioribus',
    text: 'If you are pained by any external thing, it is not this thing that disturbs you, but your own judgment about it. And it is in your power to wipe out this judgment now.',
    commentary: 'External events are neutral byte streams. Emotional pain is your own client-side rendering error. Patch the renderer.'
  },
  {
    id: 8,
    pillar: 'logos',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book IV.23',
    latinRef: 'Naturae concordia',
    text: 'Everything harmonizes with me, which is harmonious to thee, O Universe. Nothing for me is too early nor too late, which is in well time for thee.',
    commentary: 'Align your subsystem with the macro-universe. Resistance to cosmic reality causes friction; acceptance unlocks frictionless flow.'
  },
  {
    id: 9,
    pillar: 'citadel',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book VIII.48',
    latinRef: 'Arx invicta',
    text: 'Remember that the ruling center becomes invincible when it withdraws into itself and rests content with itself, doing nothing which it does not will to do.',
    commentary: 'The Sovereign Self requires no external validation. When anchored in virtue, no external vector can compromise the inner fortress.'
  },
  {
    id: 10,
    pillar: 'memento-mori',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book IV.48',
    latinRef: 'Fluxus temporis',
    text: 'Think continually of all the men who were once full of life, and now lie dead. Consider how ephemeral and worthless human things are: yesterday a spot of semen, tomorrow ashes or a mummy.',
    commentary: 'Zoom out into deep time. Human fame and vanity are cosmic blips. Act with precision in the present moment.'
  },
  {
    id: 11,
    pillar: 'amor-fati',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book IV.1',
    latinRef: 'Ignis omnia vorans',
    text: 'A blazing fire makes flame and brightness out of everything that is thrown into it.',
    commentary: 'Be a thermonuclear reactor, not a delicate flame that wind extinguishes. Every failure, insult, or setback is fuel for higher luminance.'
  },
  {
    id: 12,
    pillar: 'discipline',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book IX.5',
    latinRef: 'Actio et omissio',
    text: 'Often injustice lies in what you aren\'t doing, not just what you are doing.',
    commentary: 'Passive observation of injustice is complicity. Virtue demands intentional action, not mere passive avoidance of wrongdoing.'
  },
  {
    id: 13,
    pillar: 'dichotomy',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book VII.54',
    latinRef: 'Hic et nunc',
    text: 'Everywhere and at all times it is in your power reverently to accept your present condition, to behave justly to those around you, and skillfully to treat your present thoughts so that nothing unverified slips in.',
    commentary: 'Filter incoming cognitive inputs. Verify every thought against rational logic before permitting it into your emotional pipeline.'
  },
  {
    id: 14,
    pillar: 'logos',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book VI.54',
    latinRef: 'Apes et alvus',
    text: 'That which does not harm the hive cannot harm the bee.',
    commentary: 'Individual well-being is inseparable from collective health. What degrades civilization ultimately degrades the self.'
  },
  {
    id: 15,
    pillar: 'citadel',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book VII.68',
    latinRef: 'Tranquillitas',
    text: 'Live in freedom from all constraint, with utmost peace of mind, even if the whole world clamors against you.',
    commentary: 'Public acclaim and condemnation are equally lightweight packets. Real freedom is operating entirely on internal ethical protocols.'
  },
  {
    id: 16,
    pillar: 'memento-mori',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book VII.56',
    latinRef: 'Mors transitoria',
    text: 'Think of yourself as dead. You have lived your life. Now, take what\'s left and live it properly.',
    commentary: 'Execute a mental reboot. Treat the rest of your biological lifespan as a bonus deployment, freed from past regrets and trivial fears.'
  },
  {
    id: 17,
    pillar: 'discipline',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book VIII.32',
    latinRef: 'Compositio vitae',
    text: 'You have to assemble your life yourself—action by action. And be satisfied if each one achieves its goal, as far as it can.',
    commentary: 'Mastery is granular. Life is compiled line by line, decision by decision. Optimize single instructions without being overwhelmed by the entire runtime.'
  },
  {
    id: 18,
    pillar: 'dichotomy',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book XI.16',
    latinRef: 'Animae vis',
    text: 'To live a good life: We have the potential for it. If we can learn to be indifferent to what makes no difference.',
    commentary: 'Ruthlessly cull low-signal data streams. Indifference to the uncontrollable frees 100% of your cognitive bandwidth for virtue.'
  },
  {
    id: 19,
    pillar: 'amor-fati',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book VII.9',
    latinRef: 'Cosmica nexio',
    text: 'All things are implicated with one another, and the bond is holy. For all things are coordinated, and they all combine together to form one world.',
    commentary: 'The matrix of causality is seamless. Every event has led precisely to this coordinates in spacetime. Trust the global ledger.'
  },
  {
    id: 20,
    pillar: 'citadel',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book VI.6',
    latinRef: 'Optima ultio',
    text: 'The best revenge is not to be like that.',
    commentary: 'Do not replicate corrupted behavior when attacked. Preserving your own integrity is the ultimate asymmetry and victory.'
  },
  {
    id: 21,
    pillar: 'discipline',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book IV.24',
    latinRef: 'Pauca age',
    text: '"Do few things, if you\'d have calm." For by paring away the unnecessary, you will reap the double benefit of doing less, and doing it better.',
    commentary: 'Radical simplification. Subtract low-value loops to maximize execution quality on the critical core.'
  },
  {
    id: 22,
    pillar: 'memento-mori',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book II.14',
    latinRef: 'Praesens momentum',
    text: 'Even if you were to live three thousand years, remember that no one loses any other life than this which he now lives, nor is his life anything other than what he is now losing.',
    commentary: 'You only ever possess the single microsecond of now. The longest life and shortest life lose the exact same moment at death.'
  },
  {
    id: 23,
    pillar: 'logos',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book X.16',
    latinRef: 'Bonus esto',
    text: 'Waste no more time arguing about what a good man should be. Be one.',
    commentary: 'Zero-latency execution. Stop philosophizing into endless loops; immediately instantiate virtue in the physical world.'
  },
  {
    id: 24,
    pillar: 'dichotomy',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book XII.3',
    latinRef: 'Tria elementa',
    text: 'Body, breath, mind: of these, the first two are yours only in so far as they are your care; the third alone is truly your own.',
    commentary: 'Physical matter and biological breath will disperse into entropy. The conscious sovereign will is your sole genuine asset.'
  },
  {
    id: 25,
    pillar: 'citadel',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book IX.42',
    latinRef: 'Scutum mentis',
    text: 'When you are offended at any man\'s shameless conduct, immediately ask yourself: Is it possible for shameless men not to be in the world? It is not possible. Do not then require what is impossible.',
    commentary: 'Eliminate irrational expectations. Chaos and ignorance are expected parameters in human topology. Immunize yourself against surprise.'
  },
  {
    id: 26,
    pillar: 'amor-fati',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book X.35',
    latinRef: 'Amor fati',
    text: 'Accept the things to which fate binds you, and love the people with whom fate brings you together, but do so with all your heart.',
    commentary: 'Deep surrender to destiny is not resignation; it is passionate collaboration with the fabric of existence.'
  },
  {
    id: 27,
    pillar: 'discipline',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book V.16',
    latinRef: 'Animae tinctura',
    text: 'The soul becomes dyed with the color of its thoughts. Dye it then with a continuous series of thoughts like these.',
    commentary: 'Neural pathways crystallize around repeated inputs. Immerse your consciousness in noble concepts until virtue becomes your default reflex.'
  },
  {
    id: 28,
    pillar: 'memento-mori',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book VI.28',
    latinRef: 'Cessatio pugnae',
    text: 'Death is a cessation from the impression of the senses, the tyranny of the passions, the errors of the mind, and the servitude of the flesh.',
    commentary: 'Death is the ultimate release of tension, a graceful dissolution back into the elements. Fear of it is an irrational cognitive error.'
  },
  {
    id: 29,
    pillar: 'logos',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book VII.13',
    latinRef: 'Membrum sumus',
    text: 'As limbs of one body are individually connected, so rational beings are formed for one common cooperation.',
    commentary: 'We are nodes in a single decentralized network. Sabotaging another node damages network throughput for the whole.'
  },
  {
    id: 30,
    pillar: 'dichotomy',
    author: 'Marcus Aurelius',
    source: 'Meditations, Book VI.32',
    latinRef: 'Duae partes',
    text: 'To my body all things are indifferent; to my mind, all things are indifferent which are not its own operations.',
    commentary: 'Pure Stoic clarity: Anything that is not your own conscious choice is fundamentally external and cannot touch your moral character.'
  }
];

export const DICHOTOMY_SCENARIOS = [
  {
    id: 'crit',
    situation: 'Harsh public criticism or online hostility',
    category: 'Externals',
    inControl: ['My internal composure', 'Extracting constructive signal', 'Choosing not to respond impulsively'],
    outOfControl: ['Their perspective & insults', 'How others react to them', 'Unfair judgments']
  },
  {
    id: 'delay',
    situation: 'Project deadline blocked by external failure',
    category: 'Circumstances',
    inControl: ['Pivoting strategy immediately', 'Transparent communication', 'Staying focused without panic'],
    outOfControl: ['The vendor failure itself', 'Past lost time', 'Client initial frustration']
  },
  {
    id: 'health',
    situation: 'Sudden injury or biological setback',
    category: 'Body',
    inControl: ['Following medical protocol', 'Maintaining mental fortitude', 'Directing energy to cognitive pursuits'],
    outOfControl: ['Biological healing speed', 'The occurrence of injury', 'Physical pain signals']
  },
  {
    id: 'market',
    situation: 'Financial market crash or economic downturn',
    category: 'Fortune',
    inControl: ['Prudent resource management', 'Skill adaptation', 'Living simply with contentment'],
    outOfControl: ['Macroeconomic forces', 'Asset price volatility', 'Global supply chains']
  }
];

export const SENECA_JOURNAL_PROMPTS = [
  {
    key: 'faults',
    title: 'Fault Vector Analysis',
    question: 'What error of judgment or impulse did I catch in my runtime today?'
  },
  {
    key: 'virtue',
    title: 'Virtue Subroutine',
    question: 'Where did I act with courage, justice, temperance, or wisdom today?'
  },
  {
    key: 'better',
    title: 'Optimization Patch',
    question: 'How can I execute cleaner, calmer, and more purposefully tomorrow?'
  }
];
