/**
 * Stoic Philosophy Knowledge Base & Interactive Exercises Data
 * Stoa Poikile 3D Sanctuary
 */

export const STOIC_DATA = {
  virtues: [
    {
      id: "wisdom",
      title: "Wisdom (Sophia / Phronesis)",
      greek: "ΣΟΦΙΑ & ΦΡΟΝΗΣΙΣ",
      subtitle: "The knowledge of what is good, what is bad, and what is indifferent.",
      color: "#38bdf8",
      accentRgb: [56, 189, 248],
      icon: "🧠",
      locationName: "Library of Epictetus",
      coords: { x: 0, y: 1.8, z: -35 },
      targetLook: { x: 0, y: 3, z: -48 },
      desc: "Practical wisdom is the ability to navigate complex situations logically, informed by truth and reason. It demands separating reality from our subjective impressions.",
      tenets: [
        "Distinguish between what you control and what you do not.",
        "Question initial impressions before accepting them as truth.",
        "Seek the Logos — the underlying rational order of nature."
      ],
      quote: {
        text: "Men are disturbed not by things, but by the view which they take of them.",
        author: "Epictetus",
        source: "Enchiridion, V"
      }
    },
    {
      id: "courage",
      title: "Courage (Andreia)",
      greek: "ΑΝΔΡΕΙΑ",
      subtitle: "The endurance of hardship, the resistance of fear, and standing firm in truth.",
      color: "#f59e0b",
      accentRgb: [245, 158, 11],
      icon: "⚔️",
      locationName: "Bastion of Marcus Aurelius",
      coords: { x: -35, y: 1.8, z: 0 },
      targetLook: { x: -48, y: 3, z: 0 },
      desc: "Stoic courage is not the absence of fear, but the mastery of it. It is moral fortitude: facing mortality (Memento Mori), standing up for justice, and enduring physical or psychological pain with poise.",
      tenets: [
        "Endure and renounce (Anékhou kai apékhou).",
        "View adversity as an sparring partner sent by fate.",
        "Do the right thing even when it costs you comfort or acclaim."
      ],
      quote: {
        text: "The impediment to action advances action. What stands in the way becomes the way.",
        author: "Marcus Aurelius",
        source: "Meditations, V.20"
      }
    },
    {
      id: "justice",
      title: "Justice (Dikaiosyne)",
      greek: "ΔΙΚΑΙΟΣΥΝΗ",
      subtitle: "Duty to the human community, fairness, and universal brotherhood (Cosmopolitanism).",
      color: "#10b981",
      accentRgb: [16, 185, 129],
      icon: "⚖️",
      locationName: "Forum of Universal Sympatheia",
      coords: { x: 35, y: 1.8, z: 0 },
      targetLook: { x: 48, y: 3, z: 0 },
      desc: "To the Stoic, justice is our highest social virtue. We are born for cooperation, like feet, hands, and the rows of the upper and lower teeth. Injustice harms the wrongdoer more than the victim.",
      tenets: [
        "Sympatheia: We are cells in the cosmic organism of humanity.",
        "Hierocles' Circles: Expand your care from self, to family, city, and all humanity.",
        "Act with unwavering integrity and benevolence toward all."
      ],
      quote: {
        text: "That which is not good for the beehive cannot be good for the bee.",
        author: "Marcus Aurelius",
        source: "Meditations, VI.54"
      }
    },
    {
      id: "temperance",
      title: "Temperance (Sophrosyne)",
      greek: "ΣΩΦΡΟΣΥΝΗ",
      subtitle: "Self-mastery, moderation, discipline, and freedom from destructive passions.",
      color: "#a855f7",
      accentRgb: [168, 85, 247],
      icon: "🌊",
      locationName: "Pavilion of Equanimity (Ataraxia)",
      coords: { x: 0, y: 1.8, z: 35 },
      targetLook: { x: 0, y: 3, z: 48 },
      desc: "Moderation is knowing what is enough. It is the mastery of impulses, avoiding excess in desires and aversions, and safeguarding tranquility (Ataraxia) amidst turmoil.",
      tenets: [
        "Desire only what depends on you, and fear only what is within.",
        "Voluntary discomfort strengthens the soul against sudden loss.",
        "Equanimity: Maintain balance in prosperity and poverty alike."
      ],
      quote: {
        text: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.",
        author: "Epictetus",
        source: "Fragments, 129"
      }
    },
    {
      id: "rotunda",
      title: "The Central Rotunda (Arx Mentis)",
      greek: "ΑΚΡΟΠΟΛΙΣ ΤΗΣ ΨΥΧΗΣ",
      subtitle: "The Inner Citadel — Sanctuary of the Ruling Center (Hegemonikon).",
      color: "#e2e8f0",
      accentRgb: [226, 232, 240],
      icon: "🏛️",
      locationName: "Sanctuary of the Hegemonikon",
      coords: { x: 0, y: 1.8, z: 0 },
      targetLook: { x: 0, y: 4, z: -10 },
      desc: "The inner citadel is the unassailable chamber of your rational mind. External storms cannot enter unless you open the gates through faulty judgment.",
      tenets: [
        "Retreat into yourself: No place is more peaceful than one's own soul.",
        "Things cannot touch the mind; our disturbances arise only from within.",
        "Guard your Hegemonikon (ruling faculty) above all treasures."
      ],
      quote: {
        text: "Remember that the ruling center becomes invincible when it withdraws into itself and rests content.",
        author: "Marcus Aurelius",
        source: "Meditations, VIII.48"
      }
    }
  ],

  philosophers: [
    {
      name: "Marcus Aurelius",
      title: "The Philosopher Emperor (121 – 180 CE)",
      role: "Emperor of Rome & Author of 'Meditations'",
      image: "👑",
      bio: "The last of the 'Five Good Emperors'. Wrote his personal journal, now known as 'Meditations', while on military campaigns along the Danube river. He practiced Stoicism not in isolated luxury, but while carrying the weight of an empire, plagues, and betrayals.",
      keyWorks: ["Meditations (Τὰ εἰς ἑαυτόν)"],
      coreConcept: "The Inner Citadel & Duty to the Cosmopolis",
      quote: "Waste no more time arguing about what a good man should be. Be one."
    },
    {
      name: "Seneca the Younger",
      title: "The Statesman & Dramatist (c. 4 BCE – 65 CE)",
      role: "Roman Senator, Advisor, Playwright & Essayist",
      image: "📜",
      bio: "A brilliant stylist and pragmatic philosopher who navigated the perilous imperial court of Nero. Seneca explored the psychology of anger, grief, leisure, and time with poetic clarity and profound psychological depth.",
      keyWorks: ["Letters from a Stoic (Epistulae Morales)", "On the Shortness of Life", "On Anger", "On Tranquility of Mind"],
      coreConcept: "Mastery of Time & Praemeditatio Malorum",
      quote: "We suffer more often in imagination than in reality."
    },
    {
      name: "Epictetus",
      title: "The Enslaved Teacher of Freedom (c. 50 – 135 CE)",
      role: "Freed Slave & Founder of the Nicopolis School",
      image: "⛓️",
      bio: "Born into slavery in Hierapolis (modern Turkey), crippled by an abusive master, Epictetus discovered philosophy through Musonius Rufus. After gaining freedom, he founded the most influential Stoic school in Greece. His razor-sharp Socratic pedagogy focused entirely on what is within our control.",
      keyWorks: ["Discourses (recorded by Arrian)", "Enchiridion (The Manual)"],
      coreConcept: "Dichotomy of Control & Prohairesis (Moral Will)",
      quote: "Freedom is the only worthy goal in life. It is won by disregarding things that lie beyond our control."
    },
    {
      name: "Zeno of Citium",
      title: "The Founder of the Stoa (c. 334 – 262 BCE)",
      role: "Phoenician Merchant & Founder of Stoicism in Athens",
      image: "🏛️",
      bio: "Shipwrecked near Athens after losing his entire cargo of purple dye, Zeno walked into a bookseller, read Xenophon's Memorabilia, and asked 'Where can I find men like Socrates?' He began teaching at the Stoa Poikile (Painted Porch) in the Agora of Athens.",
      keyWorks: ["Republic (early work)", "On Life According to Nature"],
      coreConcept: "Living in Harmony with Nature (Homologoumenos te physei zen)",
      quote: "Happiness is a good flow of life (euroia biou)."
    }
  ],

  quotes: [
    {
      text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
      author: "Marcus Aurelius",
      source: "Meditations, IV.3",
      category: "control",
      reflection: "When panic strikes, pause and divide the situation: Which part belongs to your choices, and which belongs to circumstances?"
    },
    {
      text: "We suffer more often in imagination than in reality.",
      author: "Seneca",
      source: "Letters from a Stoic, XIII",
      category: "anxiety",
      reflection: "Anxiety projects catastrophic futures that rarely materialize. Ground your mind in the immediate present second."
    },
    {
      text: "The impediment to action advances action. What stands in the way becomes the way.",
      author: "Marcus Aurelius",
      source: "Meditations, V.20",
      category: "resilience",
      reflection: "An obstacle is not a dead end; it is an invitation to practice patience, creativity, or fortitude."
    },
    {
      text: "It is not death that a man should fear, but he should fear never beginning to live.",
      author: "Marcus Aurelius",
      source: "Meditations, XII.1",
      category: "death",
      reflection: "Memento Mori is not grim gloom; it is the ultimate wake-up call to bring deep intention to today."
    },
    {
      text: "If you want something good, get it from yourself.",
      author: "Epictetus",
      source: "Discourses, I.29",
      category: "virtue",
      reflection: "Validation, peace, and self-respect cannot be imported from outside praise. They are cultivated from your own conscience."
    },
    {
      text: "Begin at once to live, and count each separate day as a separate life.",
      author: "Seneca",
      source: "Letters from a Stoic, CI",
      category: "time",
      reflection: "Treat today as a complete, sovereign life cycle: awake with purpose, act with virtue, rest in peace."
    },
    {
      text: "No man is free who is not master of himself.",
      author: "Epictetus",
      source: "Fragments, 35",
      category: "temperance",
      reflection: "If a notification, an insult, or a trivial craving can derail your mood, you are not sovereign."
    },
    {
      text: "How much time he gains who does not look to see what his neighbor says or does or thinks, but only at what he does himself.",
      author: "Marcus Aurelius",
      source: "Meditations, IV.18",
      category: "focus",
      reflection: "Turn your attention inward. Stop auditing the world's flaws and start mastering your own character."
    },
    {
      text: "Life is very short and anxious for those who forget the past, neglect the present, and fear the future.",
      author: "Seneca",
      source: "On the Shortness of Life, XVI",
      category: "time",
      reflection: "The present is the only slice of time we actually possess. Anchor yourself firmly in the now."
    },
    {
      text: "Don't explain your philosophy. Embody it.",
      author: "Epictetus",
      source: "Enchiridion, XLVI",
      category: "action",
      reflection: "True philosophy is not debate or academic jargon. It is how you treat people when you are exhausted."
    },
    {
      text: "A gem cannot be polished without friction, nor a man perfected without trials.",
      author: "Seneca",
      source: "Moral Essays",
      category: "resilience",
      reflection: "Welcome hardships as the whetstone that sharpens your intellect and character."
    },
    {
      text: "Accept the things to which fate binds you, and love the people with whom fate brings you together, but do so with all your heart.",
      author: "Marcus Aurelius",
      source: "Meditations, VI.39",
      category: "sympatheia",
      reflection: "Amor Fati means loving fate unconditionally, and embracing our fellow humans as brothers."
    },
    {
      text: "Wealth consists not in having great possessions, but in having few wants.",
      author: "Epictetus",
      source: "Fragments",
      category: "temperance",
      reflection: "When you reduce your dependencies, you expand your indestructible freedom."
    },
    {
      text: "Never say about anything, 'I have lost it,' but only 'I have given it back.'",
      author: "Epictetus",
      source: "Enchiridion, XI",
      category: "loss",
      reflection: "Everything in life is borrowed from the Cosmos. Hold possessions and relationships with open hands."
    },
    {
      text: "When you arise in the morning think of what a privilege it is to be alive, to think, to enjoy, to love.",
      author: "Marcus Aurelius",
      source: "Meditations, II.1",
      category: "gratitude",
      reflection: "Before looking at a screen, pause for 30 seconds to honor the gift of consciousness."
    }
  ],

  // Interactive Dichotomy of Control Exercise Items
  dichotomyItems: [
    { text: "My reaction when someone cuts me off in traffic", inControl: true, reason: "Your judgment and emotional reaction are your sovereign choice." },
    { text: "Whether it rains during an outdoor event", inControl: false, reason: "Weather is a natural external force beyond human will." },
    { text: "My commitment to speak the truth with kindness", inControl: true, reason: "Your integrity and intentions belong solely to your moral will (Prohairesis)." },
    { text: "Other people's opinion or criticism of my work", inControl: false, reason: "Reputation lives in the minds of others, not in your own hands." },
    { text: "How much effort I put into my preparations", inControl: true, reason: "Your discipline and focus are under your direct command." },
    { text: "The final market outcome or sales results", inControl: false, reason: "Outcomes involve market variables, timing, and other people's decisions." },
    { text: "My response when experiencing physical sickness", inControl: true, reason: "While sickness happens to the body, patience and endurance belong to the mind." },
    { text: "Past mistakes I made five years ago", inControl: false, reason: "The past is immutable; only current action can be directed." },
    { text: "Setting healthy boundaries with toxic behavior", inControl: true, reason: "You choose your presence, responses, and personal standards." },
    { text: "Sudden economic downturns or inflation", inControl: false, reason: "Macroeconomics are external; adjusting your frugal lifestyle is internal." },
    { text: "Choosing to forgive and let go of resentment", inControl: true, reason: "Holding onto anger is drinking poison expecting the other to suffer." },
    { text: "The genetic traits and background I was born with", inControl: false, reason: "Your origins are given by nature; how you use your life is your art." }
  ],

  // Daily Examen Seneca Prompts
  examenQuestions: [
    {
      id: "q1",
      title: "1. What bad habit or reactive impulse did I curb today?",
      hint: "Did you catch anger before speaking? Did you resist mindless scrolling or complaint?"
    },
    {
      id: "q2",
      title: "2. Where did I act with courage, justice, or clarity?",
      hint: "Celebrate moments where you stayed calm, spoke truthfully, or helped a fellow human."
    },
    {
      id: "q3",
      title: "3. What duty was left undone, and how will I improve tomorrow?",
      hint: "Identify without self-flagellation where you can sharpen your focus when dawn arrives."
    }
  ],

  // Premeditation of Evils (Praemeditatio Malorum) scenarios
  praemeditatioScenarios: [
    {
      title: "Facing Rejection or Criticism",
      premise: "Imagine receiving harsh, unchartered criticism on your most cherished project.",
      stoicRemedy: "Remember: 'If they truly knew my other flaws, they wouldn't have mentioned only these.' Their judgment does not define your character. Extract any useful lesson; discard the sting.",
      philosopher: "Epictetus"
    },
    {
      title: "Loss of Comfort, Money, or Status",
      premise: "Imagine a sudden disruption that strips away your financial safety cushion.",
      stoicRemedy: "Practice voluntary simplicity. Seneca advises: 'Spend a few days on the cheapest fare and rough clothes, asking yourself: Is this the condition that I feared?' You will find your soul intact.",
      philosopher: "Seneca"
    },
    {
      title: "Difficult & Uncooperative People",
      premise: "Imagine meeting rude, meddling, ungrateful, arrogant, and dishonest individuals today.",
      stoicRemedy: "Marcus Aurelius: 'They act this way because they cannot distinguish good from evil. But I have seen the nature of the wrongdoer, that he is akin to me. None of them can hurt me with what is shameful.'",
      philosopher: "Marcus Aurelius"
    },
    {
      title: "The Ultimate Horizon (Memento Mori)",
      premise: "Contemplate that this breath or this day could be your last on this revolving sphere.",
      stoicRemedy: "Marcus Aurelius: 'You could leave life right now. Let that determine what you do and say and think.' Let this truth dissolve petty grudges and infuse the moment with reverence.",
      philosopher: "Marcus Aurelius"
    }
  ]
};
