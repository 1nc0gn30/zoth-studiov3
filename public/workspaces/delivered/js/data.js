// DELIVERED. - Town Center Virginia Beach Hyper-Local Delivery Network
// Data Store & Geography Definitions

export const TOWN_CENTER_GEO = {
  name: "Town Center of Virginia Beach",
  lat: 36.8427,
  lng: -76.1344,
  radiusMiles: 1.0,
  radiusMeters: 1609.34,
  city: "Virginia Beach",
  state: "VA",
  zip: "23462"
};

export const RESIDENCES = [
  {
    id: "the-cosmopolitan",
    name: "The Cosmopolitan Apartments",
    address: "4545 Commerce St, Virginia Beach, VA 23462",
    type: "Luxury High-Rise",
    floors: 14,
    units: 342,
    lat: 36.8422,
    lng: -76.1356,
    elevatorCodeReq: true,
    residentCount: 520,
    activeCouriers: 3,
    description: "Upscale high-rise apartment living in the heart of Town Center."
  },
  {
    id: "westin-residences",
    name: "The Westin Residences & Hotel",
    address: "4535 Commerce St, Virginia Beach, VA 23462",
    type: "High-Rise Condos & Hotel",
    floors: 38,
    units: 119,
    lat: 36.8415,
    lng: -76.1348,
    elevatorCodeReq: true,
    residentCount: 210,
    activeCouriers: 2,
    description: "Virginia's tallest residential tower; exclusive private residences & guest suites."
  },
  {
    id: "studio-78",
    name: "Studio 78 / Encore 4505",
    address: "4505 Main St, Virginia Beach, VA 23462",
    type: "Urban Apartments",
    floors: 6,
    units: 286,
    lat: 36.8436,
    lng: -76.1332,
    elevatorCodeReq: false,
    residentCount: 390,
    activeCouriers: 4,
    description: "Modern loft-style residences directly overlooking Central Park Avenue."
  },
  {
    id: "the-premier",
    name: "The Premier at Town Center",
    address: "293 20th St, Virginia Beach, VA 23462",
    type: "Luxury Apartments",
    floors: 7,
    units: 220,
    lat: 36.8441,
    lng: -76.1362,
    elevatorCodeReq: true,
    residentCount: 310,
    activeCouriers: 2,
    description: "Contemporary mid-rise residential community bordering Market Street."
  },
  {
    id: "city-walk",
    name: "City Walk Town Center",
    address: "4333 Columbus St, Virginia Beach, VA 23462",
    type: "Apartments",
    floors: 5,
    units: 302,
    lat: 36.8450,
    lng: -76.1315,
    elevatorCodeReq: false,
    residentCount: 440,
    activeCouriers: 3,
    description: "Spacious community with direct breezeway connection to shopping & dining."
  },
  {
    id: "hyatt-place",
    name: "Hyatt Place Town Center",
    address: "333 Constitution Dr, Virginia Beach, VA 23462",
    type: "Hotel & Extended Stay",
    floors: 8,
    units: 127,
    lat: 36.8410,
    lng: -76.1370,
    elevatorCodeReq: false,
    residentCount: 140,
    activeCouriers: 1,
    description: "Hotel suites with high guest turnover & rapid room deliveries."
  },
  {
    id: "hilton-garden",
    name: "Hilton Garden Inn Town Center",
    address: "180 SW Rosemont Rd, Virginia Beach, VA 23462",
    type: "Hotel",
    floors: 6,
    units: 176,
    lat: 36.8398,
    lng: -76.1330,
    elevatorCodeReq: false,
    residentCount: 180,
    activeCouriers: 1,
    description: "Town Center hotel with executive business travelers and weekend guests."
  },
  {
    id: "armada-hoffler",
    name: "Armada Hoffler Tower Suites",
    address: "222 Central Park Ave, Virginia Beach, VA 23462",
    type: "Executive Lofts",
    floors: 23,
    units: 64,
    lat: 36.8431,
    lng: -76.1345,
    elevatorCodeReq: true,
    residentCount: 95,
    activeCouriers: 2,
    description: "Executive suites and rooftop resident lofts above premier commercial plaza."
  }
];

export const MERCHANTS = [
  {
    id: "yard-house",
    name: "Yard House",
    category: "Dining",
    cuisine: "American / Gastropub",
    address: "4498 Main St",
    lat: 36.8432,
    lng: -76.1338,
    rating: 4.8,
    reviews: 1420,
    prepTime: "12-18 min",
    courierRollTime: "3-5 min",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    popularTag: "Late Night Hotspot",
    items: [
      { id: "yh-1", name: "Truffle Cheese Fries", desc: "Crisp skinny fries, white truffle oil, shaved parmesan, garlic herb dip", price: 11.50, category: "Appetizers" },
      { id: "yh-2", name: "Poke Nachos", desc: "Marinated raw ahi tuna, avocado, serranos, wonton crisps, sweet soy, sriracha aioli", price: 16.95, category: "Appetizers" },
      { id: "yh-3", name: "(Vampire) Garlic Cheese Burger", desc: "Garlic butter brioche, aged cheddar, crispy shallots, chipotle mayo, fries", price: 17.25, category: "Entrees" },
      { id: "yh-4", name: "Nashville Hot Chicken Sandwich", desc: "Spicy fried chicken breast, spicy slaw, dill pickles, toasted brioche bun", price: 16.50, category: "Entrees" },
      { id: "yh-5", name: "Craft Root Beer Draft Jug (32oz)", desc: "Fresh bottled house draft root beer on ice", price: 6.00, category: "Drinks" }
    ]
  },
  {
    id: "tupelo-honey",
    name: "Tupelo Honey Southern Kitchen",
    category: "Dining",
    cuisine: "Modern Southern",
    address: "4501 Main St",
    lat: 36.8435,
    lng: -76.1336,
    rating: 4.9,
    reviews: 980,
    prepTime: "15-20 min",
    courierRollTime: "3-4 min",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
    popularTag: "Resident Favorite",
    items: [
      { id: "th-1", name: "Famous Cathead Biscuits & Blueberry Jam", desc: "Two jumbo scratch buttermilk biscuits with whipped blueberry jam and honey butter", price: 7.00, category: "Appetizers" },
      { id: "th-2", name: "Honey Dusted Bone-In Fried Chicken", desc: "Half bird brined 18 hours, signature honey dust, milk gravy, mac-n-cheese", price: 21.95, category: "Entrees" },
      { id: "th-3", name: "Griddled Mountain Mac-N-Cheese", desc: "Aged white cheddar sauce, crispy cheese crust, green onions", price: 8.50, category: "Sides" },
      { id: "th-4", name: "Shoo Mercy Sweet Tea Glazed Ribs", desc: "Tender ribs brushed with spiced sweet tea glaze and house pickled peppers", price: 24.50, category: "Entrees" }
    ]
  },
  {
    id: "cantina-laredo",
    name: "Cantina Laredo",
    category: "Dining",
    cuisine: "Modern Mexican",
    address: "4505 Commerce St",
    lat: 36.8426,
    lng: -76.1352,
    rating: 4.7,
    reviews: 860,
    prepTime: "10-15 min",
    courierRollTime: "2-4 min",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    popularTag: "Fresh Tableside Guac",
    items: [
      { id: "cl-1", name: "Top Shelf Fresh Guacamole", desc: "Made fresh per order: Hass avocados, jalapeños, red onion, cilantro, fresh lime, warm chips", price: 13.00, category: "Appetizers" },
      { id: "cl-2", name: "Sizzling Steak & Chicken Fajitas", desc: "Mesquite grilled skirt steak and chicken, sauteed peppers & onions, handmade flour tortillas", price: 23.50, category: "Entrees" },
      { id: "cl-3", name: "Queso Blanco Dip & Chips", desc: "Melted Monterey Jack cheese, green chiles, roasted poblano", price: 9.50, category: "Appetizers" },
      { id: "cl-4", name: "Tres Leches Cake", desc: "Moist sponge soaked in sweet three-milk cream with fresh strawberries", price: 8.00, category: "Dessert" }
    ]
  },
  {
    id: "town-center-cold-pressed",
    name: "Town Center Cold Pressed",
    category: "Cafe & Juice",
    cuisine: "Organic Juice / Acai / Coffee",
    address: "168 Central Park Ave",
    lat: 36.8429,
    lng: -76.1340,
    rating: 4.95,
    reviews: 1210,
    prepTime: "5-8 min",
    courierRollTime: "2-3 min",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    popularTag: "Super Fast (5 Min)",
    items: [
      { id: "tc-1", name: "The VB Sunrise Cold Pressed Juice (16oz)", desc: "Valencia orange, pineapple, carrot, ginger, turmeric, organic honey", price: 9.50, category: "Juices" },
      { id: "tc-2", name: "Blue Majik Superfood Acai Bowl", desc: "Organic acai, blue spirulina base, gluten-free granola, bananas, strawberries, chia, honey drizzle", price: 13.50, category: "Bowls" },
      { id: "tc-3", name: "Truffle Sourdough Avocado Toast", desc: "Artisan sourdough, smashed Hass avocado, microgreens, everything seed, black truffle oil", price: 11.00, category: "Food" },
      { id: "tc-4", name: "Iced Oat Milk Madagascar Vanilla Latte", desc: "Double shot espresso, house vanilla bean syrup, creamy oat milk", price: 6.50, category: "Coffee" }
    ]
  },
  {
    id: "zushi-bistro",
    name: "Zushi Japanese Bistro",
    category: "Dining",
    cuisine: "Sushi / Japanese",
    address: "4540 Main St",
    lat: 36.8430,
    lng: -76.1330,
    rating: 4.85,
    reviews: 730,
    prepTime: "12-16 min",
    courierRollTime: "3-5 min",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
    popularTag: "Fresh Cut Daily",
    items: [
      { id: "zs-1", name: "Town Center Signature Volcano Roll", desc: "Spicy tuna, tempura crunch, avocado, baked spicy crab, eel sauce, masago", price: 16.50, category: "Rolls" },
      { id: "zs-2", name: "Crispy Spicy Tuna Rice Cubes (4pc)", desc: "Pan-crisped sushi rice, spicy minced bigeye tuna, jalapeño slice, sweet soy", price: 12.00, category: "Appetizers" },
      { id: "zs-3", name: "Salmon Lover Nigiri Combo", desc: "6 pieces fresh Ora King salmon nigiri + salmon avocado roll", price: 21.00, category: "Entrees" },
      { id: "zs-4", name: "Pork Gyoza Dumplings (6pc)", desc: "Pan-seared handmade dumplings with ponzu dipping sauce", price: 8.50, category: "Appetizers" }
    ]
  },
  {
    id: "bravo-italian",
    name: "Bravo! Italian Kitchen",
    category: "Dining",
    cuisine: "Italian / Pasta",
    address: "193 Central Park Ave",
    lat: 36.8425,
    lng: -76.1346,
    rating: 4.65,
    reviews: 640,
    prepTime: "15-22 min",
    courierRollTime: "3-5 min",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
    popularTag: "Hearty Portions",
    items: [
      { id: "br-1", name: "Pasta Bravo Signature", desc: "Rigatoni, grilled chicken, fresh mushrooms, roasted red pepper cream sauce", price: 19.50, category: "Pasta" },
      { id: "br-2", name: "Crispy Calamari Fritti", desc: "Lightly breaded calamari, marinara, lemon garlic aioli", price: 14.50, category: "Appetizers" },
      { id: "br-3", name: "Wood-Fired Margherita Flatbread", desc: "Vine-ripened tomatoes, fresh mozzarella, torn basil, extra virgin olive oil", price: 13.00, category: "Pizza" }
    ]
  },
  {
    id: "keagans-pub",
    name: "Keagan's Irish Pub & Kitchen",
    category: "Dining",
    cuisine: "Irish Pub / Comfort Food",
    address: "244 Market St",
    lat: 36.8438,
    lng: -76.1350,
    rating: 4.75,
    reviews: 890,
    prepTime: "10-15 min",
    courierRollTime: "2-4 min",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80",
    popularTag: "Open Till 2 AM",
    items: [
      { id: "kg-1", name: "Beer Battered Fish & Chips", desc: "Wild Atlantic cod, crispy pub fries, tartar sauce, malt vinegar slaw", price: 17.50, category: "Entrees" },
      { id: "kg-2", name: "Irish Reuben Egg Rolls (3pc)", desc: "Corned beef, sauerkraut, Swiss cheese, thousand island dipping dip", price: 11.50, category: "Appetizers" },
      { id: "kg-3", name: "Traditional Shepherd's Pie", desc: "Braised minced beef & lamb, sweet peas, carrots, rich gravy, baked mashed potato top", price: 18.00, category: "Entrees" }
    ]
  },
  {
    id: "tc-bodega-mart",
    name: "Town Center Bodega & Mart",
    category: "Bodega & Essentials",
    cuisine: "Snacks, Drinks, Essentials",
    address: "4520 Main St",
    lat: 36.8433,
    lng: -76.1341,
    rating: 4.9,
    reviews: 420,
    prepTime: "2-4 min",
    courierRollTime: "2-3 min",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80",
    popularTag: "Instant Dispatch",
    items: [
      { id: "bg-1", name: "Celsius Sparkling Energy (Arctic Vibe / Orange)", desc: "Zero sugar fitness energy drink (12oz can)", price: 3.50, category: "Drinks" },
      { id: "bg-2", name: "Ben & Jerry's Half Baked Pint", desc: "Chocolate & vanilla ice cream with fudge brownies and gobs of chocolate chip cookie dough", price: 6.75, category: "Frozen" },
      { id: "bg-3", name: "Smartwater Electrolyte 1 Liter Bottle", desc: "Vapor-distilled pure water with electrolytes", price: 3.25, category: "Drinks" },
      { id: "bg-4", name: "USB-C Fast Charging Cable (6ft Braided)", desc: "High-speed 60W nylon braided power delivery cable", price: 12.00, category: "Electronics" },
      { id: "bg-5", name: "Hot Cheetos Limon (Large Bag)", desc: "Fiery crunchy snack with real lime kick", price: 4.25, category: "Snacks" }
    ]
  },
  {
    id: "walgreens-towncenter",
    name: "Walgreens Pharmacy Express",
    category: "Bodega & Essentials",
    cuisine: "Pharmacy, Health, Toiletries",
    address: "4400 Virginia Beach Blvd",
    lat: 36.8405,
    lng: -76.1310,
    rating: 4.6,
    reviews: 310,
    prepTime: "5-10 min",
    courierRollTime: "4-6 min",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=80",
    popularTag: "Health & Care",
    items: [
      { id: "wg-1", name: "Advil Dual Action Ibuprofen (72ct)", desc: "Fast pain relief with acetaminophen & ibuprofen", price: 11.99, category: "Health" },
      { id: "wg-2", name: "Liquid I.V. Hydration Multiplier (Lemon Lime 6pk)", desc: "Electrolyte powder drink mix for rapid hydration", price: 9.99, category: "Health" },
      { id: "wg-3", name: "Crest 3D White Toothpaste + Soft Brush Kit", desc: "Travel-friendly daily dental pack", price: 6.49, category: "Toiletries" },
      { id: "wg-4", name: "Bandaid Tough Strips Waterproof (20ct)", desc: "Heavy duty sterile wound care adhesive bandages", price: 5.29, category: "Health" }
    ]
  },
  {
    id: "target-express-vb",
    name: "Target Express (VB Blvd Corridor)",
    category: "Bodega & Essentials",
    cuisine: "Groceries & General",
    address: "4554 Virginia Beach Blvd",
    lat: 36.8402,
    lng: -76.1360,
    rating: 4.7,
    reviews: 620,
    prepTime: "8-14 min",
    courierRollTime: "4-6 min",
    image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&auto=format&fit=crop&q=80",
    popularTag: "Snack & Grocery",
    items: [
      { id: "tg-1", name: "Chobani Greek Yogurt 4-Pack (Vanilla)", desc: "High protein, creamy whole milk Greek yogurt", price: 4.99, category: "Groceries" },
      { id: "tg-2", name: "KIND Dark Chocolate Almond Sea Salt Bars (6ct)", desc: "Wholesome gluten-free snack bars with whole almonds", price: 7.49, category: "Snacks" },
      { id: "tg-3", name: "Red Bull Sugarfree 4-Pack (8.4oz)", desc: "Vitalizes body and mind on demanding workdays", price: 8.99, category: "Drinks" }
    ]
  }
];

export const ERRAND_TEMPLATES = [
  {
    id: "errand-package",
    title: "Building Package Room / Locker Pickup",
    desc: "Courier grabs your Luxer One / Amazon package from the lobby locker and delivers directly to your apartment door.",
    defaultTip: 6.00,
    icon: "package-check",
    estimatedTime: "8 min"
  },
  {
    id: "errand-keys",
    title: "Key Fob / Access Card Shuttle",
    desc: "Locked out or forgot your pool/gym fob? Courier picks up spare key from front desk or friend across Town Center.",
    defaultTip: 7.00,
    icon: "key-round",
    estimatedTime: "6 min"
  },
  {
    id: "errand-cleaners",
    title: "Town Center Cleaners Pickup & Drop",
    desc: "Courier picks up your pressed suits/dresses from Market St cleaners and delivers straight to your wardrobe rack.",
    defaultTip: 8.00,
    icon: "shirt",
    estimatedTime: "12 min"
  },
  {
    id: "errand-custom",
    title: "Custom 1-Mile Plaza Micro-Task",
    desc: "Anything legal within 1 mile: pharmacy run, coffee pickup, handoff document across buildings, or snack haul.",
    defaultTip: 5.00,
    icon: "zap",
    estimatedTime: "10 min"
  }
];

export const COURIERS = [
  {
    id: "jax-onewheel",
    name: "Jaxson 'Jax' Rivera",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    vehicle: "OneWheel GT (Custom Slick)",
    vehicleType: "onewheel",
    vehicleIcon: "zap",
    topSpeed: "20 mph",
    homeResidence: "The Westin Residences",
    totalRuns: 1420,
    rating: 5.0,
    status: "online",
    currentLat: 36.8429,
    currentLng: -76.1342,
    badge: "Plaza Speedster",
    bio: "Cruising Town Center sidewalks since 2021. Knows every elevator shortcut in The Westin and Cosmopolitan."
  },
  {
    id: "maya-skate",
    name: "Maya Chen",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    vehicle: "Loaded Cruiser Board (65mm Orangatang)",
    vehicleType: "skateboard",
    vehicleIcon: "gauge",
    topSpeed: "16 mph",
    homeResidence: "The Cosmopolitan",
    totalRuns: 892,
    rating: 4.98,
    status: "online",
    currentLat: 36.8423,
    currentLng: -76.1356,
    badge: "Smooth Carver",
    bio: "Cosmopolitan 4th floor local. Zero drink spills guaranteed; custom gyro cup holder on board."
  },
  {
    id: "derrick-ebike",
    name: "Derrick Vance",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    vehicle: "Super73 RX Electric Moto-Bike",
    vehicleType: "ebike",
    vehicleIcon: "bike",
    topSpeed: "28 mph",
    homeResidence: "Studio 78 / Encore",
    totalRuns: 2150,
    rating: 5.0,
    status: "online",
    currentLat: 36.8438,
    currentLng: -76.1328,
    badge: "Heavy Hauler",
    bio: "Large insulated dual thermal backpack. Best for big Yard House orders and multiple pizza boxes."
  },
  {
    id: "kira-fixie",
    name: "Kira Novak",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    vehicle: "State Bicycle Co. Fixed Gear",
    vehicleType: "bike",
    vehicleIcon: "circle-dot",
    topSpeed: "22 mph",
    homeResidence: "The Premier Apartments",
    totalRuns: 640,
    rating: 4.95,
    status: "online",
    currentLat: 36.8443,
    currentLng: -76.1360,
    badge: "Direct Line",
    bio: "Town Center native, daily commuter. Quickest sprints along Columbus St and Constitution Dr."
  },
  {
    id: "liam-onewheel",
    name: "Liam O'Connor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    vehicle: "OneWheel Pint X (Pint Edition)",
    vehicleType: "onewheel",
    vehicleIcon: "zap",
    topSpeed: "18 mph",
    homeResidence: "City Walk Apartments",
    totalRuns: 1115,
    rating: 4.99,
    status: "online",
    currentLat: 36.8448,
    currentLng: -76.1320,
    badge: "Night Owl",
    bio: "Specializes in midnight snacks, 7-Eleven runs, and late Yard House orders."
  }
];

export const PRICING_RULES = {
  residentSubscriptionMonthly: 9.99,
  residentSubscriptionAnnual: 89.00,
  nonMemberDeliveryFee: 2.50,
  memberDeliveryFee: 0.00,
  strictMinimumTip: 5.00,
  tipPresets: [5.00, 7.00, 10.00, 15.00],
  radiusLimitMiles: 1.0,
  estimatedAverageMinutes: 9.4
};
