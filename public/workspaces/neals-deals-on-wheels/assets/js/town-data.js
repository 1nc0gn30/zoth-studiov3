// Town Center of Virginia Beach Data & Locations
// Dedicated 1-Mile Radius Coverage for Neal's Deals On Wheels

window.TOWN_CENTER_DATA = {
  centerCoords: { x: 0, z: 0, lat: 36.8427, lng: -76.1345 }, // Plaza Fountain
  maxRadiusMiles: 1.0,

  residences: [
    {
      id: 'res-westin',
      name: 'The Westin Residences',
      category: 'Luxury High-Rise Condos & Hotel',
      address: '4535 Commerce St, Virginia Beach, VA 23462',
      distanceMiles: 0.12,
      estDeliveryMin: '8-12 min',
      units: '119 Condos / Floors 16-38',
      concierge: '24/7 Front Desk Concierge (West Lobby)',
      elevatorCode: 'Fob Access / Neal Verified',
      coord: { x: 18, z: -14, height: 38, width: 12, depth: 12, color: 0x38bdf8 },
      desc: 'Virginia’s tallest skyscraper (38 stories). Neal delivers directly to penthouse suites or lobby concierge.'
    },
    {
      id: 'res-cosmo',
      name: 'The Cosmopolitan at Town Center',
      category: 'Luxury Urban Apartments',
      address: '4545 Commerce St, Virginia Beach, VA 23462',
      distanceMiles: 0.15,
      estDeliveryMin: '10-14 min',
      units: '342 Luxury Units',
      concierge: 'Main Leasing Lobby / Package Room',
      elevatorCode: 'Callbox Direct Access',
      coord: { x: 22, z: 16, height: 26, width: 16, depth: 14, color: 0x818cf8 },
      desc: 'Mid-rise luxury living overlooking Town Center courtyard. Direct unit doorstep drop available.'
    },
    {
      id: 'res-encore',
      name: 'Encore 4505 at Town Center',
      category: 'Modern Boutique Apartments',
      address: '4505 Columbus St, Virginia Beach, VA 23462',
      distanceMiles: 0.28,
      estDeliveryMin: '12-16 min',
      units: '286 Units',
      concierge: 'Clubhouse & Concierge Hub',
      elevatorCode: 'Brivo Mobile Access',
      coord: { x: -26, z: 18, height: 22, width: 14, depth: 16, color: 0x34d399 },
      desc: 'Stylish flats across from the plaza. Fast bike courier access via Columbus St corridor.'
    },
    {
      id: 'res-premier',
      name: 'Premier Apartments & Lofts',
      category: 'Urban Mid-Rise Residences',
      address: '260 Town Center Dr, Virginia Beach, VA 23462',
      distanceMiles: 0.22,
      estDeliveryMin: '10-15 min',
      units: '180 Lofts',
      concierge: 'Lobby Secure Access',
      elevatorCode: 'Keypad Entry',
      coord: { x: -18, z: -22, height: 20, width: 15, depth: 12, color: 0xfbbf24 },
      desc: 'Central plaza lofts directly above ground-floor retail. Under 10 minute delivery guarantee.'
    },
    {
      id: 'res-columbus',
      name: 'Columbus Station Condominiums',
      category: 'Town Center Edge Residences',
      address: '4452 Columbus St, Virginia Beach, VA 23462',
      distanceMiles: 0.45,
      estDeliveryMin: '14-18 min',
      units: '210 Condos',
      concierge: 'Gated Entry / Clubhouse',
      elevatorCode: 'Resident Buzz',
      coord: { x: -42, z: 32, height: 16, width: 18, depth: 14, color: 0xf472b6 },
      desc: 'Quiet residential enclave right on the 1-mile perimeter. Zero-traffic micro-mobility routes.'
    },
    {
      id: 'res-armada',
      name: 'Armada Hoffler Tower Suites',
      category: 'Executive & Mixed-Use Tower',
      address: '222 Central Park Ave, Virginia Beach, VA 23462',
      distanceMiles: 0.08,
      estDeliveryMin: '6-10 min',
      units: 'Floors 5-21 Executive Suites',
      concierge: 'Security Desk (Main Atrium)',
      elevatorCode: 'Express High-Rise Elevators',
      coord: { x: -10, z: -8, height: 32, width: 14, depth: 14, color: 0x60a5fa },
      desc: 'Centerpiece corporate and penthouse suites of Town Center. Fast desk-side drops for professionals.'
    }
  ],

  landmarks: [
    {
      id: 'lm-fountain',
      name: 'Town Center Fountain Plaza',
      category: 'Central Civic Gathering Point',
      address: 'Market St & Central Park Ave',
      coord: { x: 0, z: 0, height: 4, width: 10, depth: 10, color: 0x06b6d4 },
      desc: 'The iconic central fountain and promenade where Neal’s courier fleet stages and dispatches.'
    },
    {
      id: 'lm-sandler',
      name: 'Sandler Center for the Performing Arts',
      category: 'Arts & Culture Landmark',
      address: '201 Market St, Virginia Beach, VA 23462',
      coord: { x: -28, z: -16, height: 18, width: 18, depth: 16, color: 0xa855f7 },
      desc: '1,300-seat state-of-the-art performance theater. Backstage and VIP lounge drop-off access.'
    },
    {
      id: 'lm-pembroke',
      name: 'Pembroke Square / District',
      category: 'Plaza Shopping & Wellness Center',
      address: '4554 Virginia Beach Blvd, Virginia Beach, VA 23462',
      coord: { x: 38, z: -35, height: 14, width: 26, depth: 20, color: 0x10b981 },
      desc: 'Expanded shopping district on the north edge of the 1-mile delivery zone.'
    }
  ],

  venues: [
    {
      id: 'v-cheesecake',
      name: 'The Cheesecake Factory',
      type: 'dining',
      cuisine: 'American • Desserts • Pasta',
      address: '228 Central Park Ave (Town Center Plaza)',
      rating: 4.8,
      reviews: 1420,
      prepTimeMin: '12-18 min',
      priceLevel: '$$',
      isPopular: true,
      badge: 'Resident Favorite',
      icon: 'cake',
      coord: { x: -14, z: 4, height: 10, width: 12, depth: 10, color: 0xf59e0b },
      desc: 'Extensive gourmet menu with over 250 items and world-famous freshly sliced cheesecakes.',
      items: [
        { id: 'cf-1', name: 'Original Cheesecake Slice with Fresh Strawberries', price: 9.95, tag: 'Signature', desc: 'Glazed fresh strawberries over our famous creamy classic cheesecake.' },
        { id: 'cf-2', name: 'Chicken Madeira & Mashed Potatoes', price: 23.95, tag: 'Bestseller', desc: 'Sauteed chicken breast topped with fresh asparagus and melted mozzarella in Madeira wine sauce.' },
        { id: 'cf-3', name: 'Avocado Eggrolls (Crispy)', price: 15.50, tag: 'Appetizer', desc: 'Avocado, sun-dried tomato, red onion and cilantro fried in crisp wrapper with tamarind-cashew dip.' },
        { id: 'cf-4', name: 'Godiva Chocolate Cheesecake Slice', price: 10.50, tag: 'Sweet', desc: 'Layers of flourless Godiva chocolate cake, Godiva chocolate cheesecake and chocolate mousse.' },
        { id: 'cf-5', name: 'Louisiana Chicken Pasta', price: 22.50, tag: 'Hearty', desc: 'Parmesan crusted chicken served over pasta with mushrooms, peppers and onions in spicy New Orleans sauce.' }
      ]
    },
    {
      id: 'v-yardhouse',
      name: 'Yard House',
      type: 'dining',
      cuisine: 'Modern American • Craft Burgers • Wings',
      address: '4549 Commerce St (Town Center)',
      rating: 4.7,
      reviews: 980,
      prepTimeMin: '10-15 min',
      priceLevel: '$$',
      isPopular: true,
      badge: 'Late Night Hotspot',
      icon: 'flame',
      coord: { x: 12, z: 6, height: 11, width: 14, depth: 10, color: 0xef4444 },
      desc: 'Great food, classic rock vibes, and late-night kitchen running hot right in the plaza.',
      items: [
        { id: 'yh-1', name: 'Poke Nachos with Spicy Mayo', price: 17.25, tag: 'Top Rated', desc: 'Crispy wontons, raw ahi tuna, avocado, serrano chiles, cilantro, nori, sweet soy & sriracha mayo.' },
        { id: 'yh-2', name: 'Kurobuta Pork Burger & Truffle Fries', price: 18.95, tag: 'Specialty', desc: 'Spicy candied bacon, white cheddar, arugula, blueberry ketchup on brioche bun.' },
        { id: 'yh-3', name: 'Firecracker Wings (10pc)', price: 16.50, tag: 'Spicy', desc: 'Tossed in spicy sweet chili sauce, served with cool ranch and sesame seeds.' },
        { id: 'yh-4', name: 'Baja Fish Tacos (3x)', price: 17.50, tag: 'Fresh', desc: 'Crisp beer-battered cod, crushed avocado, salsa, shredded cabbage, citrus sriracha aioli.' }
      ]
    },
    {
      id: 'v-pfchangs',
      name: 'P.F. Chang’s',
      type: 'asian',
      cuisine: 'Asian • Wok-Fired • Dim Sum',
      address: '4551 Virginia Beach Blvd (Town Center)',
      rating: 4.6,
      reviews: 820,
      prepTimeMin: '12-16 min',
      priceLevel: '$$',
      isPopular: true,
      badge: 'Wok Master',
      icon: 'utensils',
      coord: { x: 26, z: -10, height: 10, width: 12, depth: 12, color: 0xd97706 },
      desc: 'Scratch-made Asian classics, wok-tossed proteins, and legendary lettuce wraps.',
      items: [
        { id: 'pf-1', name: 'Chang’s Famous Chicken Lettuce Wraps', price: 15.00, tag: 'Iconic', desc: 'Secret family recipe. Crisp butter lettuce, water chestnuts, scallions, special savory sauce.' },
        { id: 'pf-2', name: 'Mongolian Beef & Jasmine Rice', price: 24.50, tag: 'Signature', desc: 'Sweet soy glaze, flank steak wok-seared with fresh garlic and snipped green onions.' },
        { id: 'pf-3', name: 'Handmade Pork Dumplings (6pc)', price: 13.50, tag: 'Dim Sum', desc: 'Pan-fried handmade dumplings with ginger-soy dipping sauce.' },
        { id: 'pf-4', name: 'Crispy Honey Shrimp', price: 23.00, tag: 'Sweet & Savory', desc: 'Lightly battered shrimp in honey sauce with candied walnuts and rice noodles.' }
      ]
    },
    {
      id: 'v-tupelo',
      name: 'Tupelo Honey Southern Kitchen',
      type: 'dining',
      cuisine: 'Southern • Brunch • Scratch Made',
      address: '4501 Main St (Town Center)',
      rating: 4.8,
      reviews: 1100,
      prepTimeMin: '14-18 min',
      priceLevel: '$$',
      isPopular: true,
      badge: 'Brunch Champion',
      icon: 'sun',
      coord: { x: -8, z: 24, height: 9, width: 11, depth: 10, color: 0xeab308 },
      desc: 'Soul-satisfying Southern scratch dishes, world-class fried chicken, and honey-drizzled biscuits.',
      items: [
        { id: 'th-1', name: 'Honey Dusted Bone-In Fried Chicken & Mac', price: 22.00, tag: 'Southern Legend', desc: 'Signature fried chicken sprinkled with Tupelo honey dust, mac-n-cheese and fresh dressed greens.' },
        { id: 'th-2', name: 'Famous Scratch Biscuits & Blueberry Jam (4-pack)', price: 8.50, tag: 'Must-Order', desc: 'Flaky oversized buttermilk biscuits served with artisan blueberry jam and whipped butter.' },
        { id: 'th-3', name: 'Shoo Mercy Sweet Potato Pancakes & Bacon', price: 17.50, tag: 'Brunch', desc: 'Spiced pecans, apple cider cured bacon, fried egg, pure maple syrup.' },
        { id: 'th-4', name: 'Southern Mac-N-Cheese Waffle with Hot Honey', price: 16.00, tag: 'Comfort', desc: 'Crispy waffle infused with sharp cheddar cheese topped with buttermilk fried tenders.' }
      ]
    },
    {
      id: 'v-coldpressed',
      name: 'Town Center Cold Pressed Juice & Cafe',
      type: 'cafe',
      cuisine: 'Cold-Pressed Juice • Acai Bowls • Specialty Coffee',
      address: '168 Central Park Ave (Town Center Plaza)',
      rating: 4.9,
      reviews: 650,
      prepTimeMin: '6-10 min',
      priceLevel: '$',
      isPopular: true,
      badge: 'Super Fast (8 Min)',
      icon: 'coffee',
      coord: { x: 4, z: -18, height: 7, width: 8, depth: 8, color: 0x10b981 },
      desc: 'Raw organic cold-pressed wellness elixirs, superfood acai bowls, and Nitro cold brew.',
      items: [
        { id: 'tc-1', name: 'The Boardwalk Green Cold-Pressed Juice (16oz)', price: 9.50, tag: 'Raw Organic', desc: 'Kale, cucumber, crisp green apple, spinach, celery, lemon & ginger.' },
        { id: 'tc-2', name: 'Town Center Power Acai Bowl', price: 13.50, tag: 'Superfood', desc: 'Organic acai, hemp granola, strawberries, blueberries, chia seeds, local honey drizzle.' },
        { id: 'tc-3', name: 'Lavender Honey Nitro Cold Brew', price: 6.75, tag: 'Coffee Bar', desc: 'Velvety smooth nitrogen cold brew with organic lavender infusion and oat milk.' },
        { id: 'tc-4', name: 'Avocado Sourdough Toast with Everything Spice', price: 10.50, tag: 'Breakfast', desc: 'Thick sourdough toast, mashed avocado, microgreens, lemon zest, chili flake.' }
      ]
    },
    {
      id: 'v-bravo',
      name: 'Bravo! Italian Kitchen',
      type: 'italian',
      cuisine: 'Italian • Wood-Fired Pizza • Pastas',
      address: '193 Central Park Ave (Town Center)',
      rating: 4.6,
      reviews: 740,
      prepTimeMin: '14-19 min',
      priceLevel: '$$',
      isPopular: false,
      badge: 'Wood-Fired',
      icon: 'pizza',
      coord: { x: -20, z: -6, height: 9, width: 11, depth: 9, color: 0xf87171 },
      desc: 'Traditional hand-rolled pastas, artisanal flatbread pizzas, and rich Italian comfort classics.',
      items: [
        { id: 'br-1', name: 'Pasta Bravo with Roasted Chicken', price: 21.50, tag: 'Signature', desc: 'Rigatoni, grilled chicken, sauteed mushrooms, spicy tomato cream sauce.' },
        { id: 'br-2', name: 'Margherita Wood-Fired Artisan Pizza', price: 17.00, tag: 'Thin Crust', desc: 'Fresh mozzarella, vine-ripened tomatoes, sweet basil, extra virgin olive oil.' },
        { id: 'br-3', name: 'Crispy Calamari with Marinara & Garlic Aioli', price: 16.00, tag: 'Appetizer', desc: 'Lightly breaded flash-fried calamari with spicy pepperoncini peppers.' },
        { id: 'br-4', name: 'Classic Tiramisu Mascarpone Cake', price: 9.50, tag: 'Dessert', desc: 'Espresso-soaked ladyfingers, velvety mascarpone cream, dark cocoa dust.' }
      ]
    },
    {
      id: 'v-ruthschris',
      name: 'Ruth’s Chris Steak House',
      type: 'steaks',
      cuisine: 'Fine Dining • USDA Prime Steaks • Seafood',
      address: '205 Central Park Ave (Armada Hoffler Concourse)',
      rating: 4.9,
      reviews: 890,
      prepTimeMin: '18-25 min',
      priceLevel: '$$$$',
      isPopular: false,
      badge: 'VIP Concierge Drop',
      icon: 'award',
      coord: { x: -6, z: -14, height: 12, width: 12, depth: 10, color: 0x9333ea },
      desc: 'Sizzling USDA Prime steaks served on 500-degree plates. White-glove tower delivery with Neal.',
      items: [
        { id: 'rc-1', name: 'Custom Aged 8oz Center-Cut Petite Filet', price: 54.00, tag: 'USDA Prime', desc: 'Tender corn-fed Midwestern beef broiled to perfection in real butter.' },
        { id: 'rc-2', name: 'Au Gratin Potatoes with Sharp Cheddar', price: 16.00, tag: 'Side', desc: 'Idaho potatoes sliced and baked in rich three-cheese cream sauce.' },
        { id: 'rc-3', name: 'Barbecued Jumbo Gulf Shrimp (5x)', price: 24.00, tag: 'Appetizer', desc: 'Sauteed New Orleans style in reduced white wine, butter, garlic and spices.' }
      ]
    },
    {
      id: 'v-keagans',
      name: 'Keagan’s Irish Pub & Kitchen',
      type: 'dining',
      cuisine: 'Irish Pub Fare • Fish & Chips • Shepherds Pie',
      address: '244 Market St (Sandler Plaza)',
      rating: 4.7,
      reviews: 610,
      prepTimeMin: '10-14 min',
      priceLevel: '$$',
      isPopular: false,
      badge: 'Late Night Eats',
      icon: 'beer',
      coord: { x: -22, z: 10, height: 8, width: 10, depth: 10, color: 0x22c55e },
      desc: 'Authentic pub favorites, fish and chips in crispy beer batter, and hot comfort food.',
      items: [
        { id: 'kg-1', name: 'Traditional Dublin Fish & Chips', price: 18.50, tag: 'Pub Classic', desc: 'Atlantic cod hand-dipped in Guinness beer batter, seasoned pub chips and homemade tartar.' },
        { id: 'kg-2', name: 'Cast Iron Shepherd’s Pie', price: 19.00, tag: 'Hearty', desc: 'Ground sirloin, carrots, peas, rich brown gravy baked beneath whipped mashed potato crust.' },
        { id: 'kg-3', name: 'Soft Bavarian Pretzels with Beer Cheese', price: 13.00, tag: 'Snack', desc: 'Three warm jumbo pretzels with house Guinness cheddar cheese dip.' }
      ]
    },
    {
      id: 'v-royalchoc',
      name: 'The Royal Chocolate',
      type: 'dessert',
      cuisine: 'Gourmet Chocolates • Fudge • Caramel Apples',
      address: '164 Central Park Ave (Town Center)',
      rating: 4.9,
      reviews: 430,
      prepTimeMin: '5-8 min',
      priceLevel: '$$',
      isPopular: true,
      badge: 'Handcrafted',
      icon: 'gift',
      coord: { x: 8, z: -12, height: 6, width: 8, depth: 8, color: 0xec4899 },
      desc: 'Virginia Beach’s premier luxury chocolatier. Artisan truffles, Belgian fudge, and gift packs.',
      items: [
        { id: 'rc-c1', name: 'Gourmet Belgian Chocolate Truffle Box (12 pc)', price: 28.00, tag: 'Gift Ready', desc: 'Assorted handcrafted dark, milk, and white chocolate truffles with silk ribbon.' },
        { id: 'rc-c2', name: 'Triple Chocolate Dipped Caramel Apple', price: 12.50, tag: 'Best Seller', desc: 'Crisp Granny Smith apple dipped in buttery caramel, layered in dark and white chocolate.' },
        { id: 'rc-c3', name: 'Artisan Sea Salt Caramel Fudge Slice', price: 6.50, tag: 'Sweet', desc: 'Fresh cooked creamy fudge topped with hand-harvested Atlantic sea salt flakes.' }
      ]
    },
    {
      id: 'v-pembroke-pharmacy',
      name: 'Town Center Pharmacy & Quick Essentials',
      type: 'errands',
      cuisine: 'Pharmacy • Health • Personal Essentials',
      address: 'Town Center Commerce Plaza',
      rating: 4.9,
      reviews: 310,
      prepTimeMin: '5-10 min',
      priceLevel: '$',
      isPopular: false,
      badge: 'Essential Errand',
      icon: 'package',
      coord: { x: 20, z: -26, height: 7, width: 10, depth: 10, color: 0x06b6d4 },
      desc: 'Over-the-counter medicine, hydration, hygiene, chargers, and immediate plaza errand runs.',
      items: [
        { id: 'ph-1', name: 'Hydration & Electrolyte Recovery Pack (Liquid I.V. + Smartwater)', price: 12.00, tag: 'Wellness', desc: '2x 1-Liter bottled water + 3 assorted electrolyte recovery packets.' },
        { id: 'ph-2', name: 'Headache & Relief Express Kit (Advil + Eye Drops)', price: 14.50, tag: 'Relief', desc: 'Advil Liqui-Gels (20ct) + soothing lubricating eye drops.' },
        { id: 'ph-3', name: 'Braided Lightning / USB-C Fast Charger Cable (6ft)', price: 18.00, tag: 'Tech', desc: 'Durable heavy-duty charging cable for iPhone / Android.' }
      ]
    },
    {
      id: 'v-barnes',
      name: 'Barnes & Noble Books & Cafe (Town Center)',
      type: 'errands',
      cuisine: 'Bestseller Books • Magazines • Stationery',
      address: '4485 Virginia Beach Blvd (Town Center)',
      rating: 4.8,
      reviews: 580,
      prepTimeMin: '8-12 min',
      priceLevel: '$$',
      isPopular: false,
      badge: 'Curated',
      icon: 'book-open',
      coord: { x: -32, z: 6, height: 9, width: 16, depth: 12, color: 0x3b82f6 },
      desc: 'Grab the latest New York Times bestsellers, magazines, notebooks, or board games delivered to your tower.',
      items: [
        { id: 'bn-1', name: 'Current #1 NYT Bestseller Hardcover Novel', price: 29.99, tag: 'Fiction/Non-Fiction', desc: 'Neal will pick up the current staff top recommendation or your requested title.' },
        { id: 'bn-2', name: 'Moleskine Classic Dotted Hardcover Journal', price: 24.95, tag: 'Stationery', desc: 'Acid-free paper, bookmark ribbon, expanding back pocket.' },
        { id: 'bn-3', name: 'Town Center Cozy Puzzle (1,000 Piece)', price: 21.99, tag: 'Leisure', desc: 'Artisan high-quality interlocking jigsaw puzzle.' }
      ]
    }
  ],

  pricingRules: {
    flatDeliveryFee: 4.99,
    maxRadiusMiles: 1.0,
    surgeFee: 0.00,
    residentMonthlyPassCost: 19.99,
    promoCodes: {
      'TOWNCENTER': { discount: 2.00, label: 'Town Center Neighbor $2.00 Off' },
      'VIPRESIDENT': { discount: 4.99, label: 'First Free Delivery for Residents' },
      'NEALWHEELS': { discount: 3.00, label: 'Neal VIP Special $3.00 Off' }
    }
  }
};
