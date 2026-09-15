/* ================================================================
   FARSLY — DATA LAYER
   All content data lives here. No server, no database.
   Prices are in Indonesian Rupiah (IDR).
   ================================================================ */

const formatPrice = n => {
  if (n >= 1000) return `Rp ${n.toLocaleString('id-ID')}`;
  return `Rp ${n}`;
};

/* ----------------------------------------------------------------
   MENU ITEMS
   ---------------------------------------------------------------- */
const MENU_ITEMS = [
  // ── Poke Bowls ──
  {
    id: 'salmon-umami',
    name: 'Salmon Umami',
    category: 'poke',
    price: 89000,
    image: 'assets/img/salmon-umami.jfif',
    description: 'Fresh Atlantic salmon over seasoned sushi rice with avocado, edamame, cucumber, and our signature ponzu drizzle.',
    ingredients: ['Salmon', 'Avocado', 'Edamame', 'Cucumber', 'Sushi Rice', 'Ponzu'],
    nutrition: { cal: 520, protein: 38, carbs: 48, fat: 18 },
    tags: ['popular', 'high-protein'],
    rating: 4.9,
    reviews: 234,
    color: '#C77B4E',
  },
  {
    id: 'spicy-tuna',
    name: 'Spicy Tuna Blaze',
    category: 'poke',
    price: 85000,
    image: 'assets/img/spicy-tuna.jfif',
    description: 'Diced yellowfin tuna tossed in chili crisp, sweet corn, cucumber, nori strips, served over brown rice with spicy mayo.',
    ingredients: ['Tuna', 'Corn', 'Cucumber', 'Nori', 'Brown Rice', 'Spicy Mayo'],
    nutrition: { cal: 480, protein: 35, carbs: 52, fat: 14 },
    tags: ['popular', 'spicy', 'high-protein'],
    rating: 4.8,
    reviews: 189,
    color: '#D45B5B',
  },
  {
    id: 'green-harvest',
    name: 'Green Harvest',
    category: 'poke',
    price: 75000,
    image: 'assets/img/green-harvest.JPG',
    description: 'Crispy marinated tofu on a quinoa base with avocado, edamame, mixed greens, and creamy sesame miso dressing.',
    ingredients: ['Tofu', 'Quinoa', 'Avocado', 'Edamame', 'Greens', 'Sesame Miso'],
    nutrition: { cal: 420, protein: 22, carbs: 45, fat: 20 },
    tags: ['vegetarian', 'popular'],
    rating: 4.7,
    reviews: 156,
    color: '#6B8068',
  },
  {
    id: 'chicken-teriyaki',
    name: 'Chicken Teriyaki Bowl',
    category: 'poke',
    price: 79000,
    image: 'assets/img/chicken-teriyaki.jfif',
    description: 'Grilled chicken thigh glazed with house teriyaki, sushi rice, charred broccolini, pickled radish, sesame.',
    ingredients: ['Chicken', 'Broccolini', 'Pickled Radish', 'Sushi Rice', 'Teriyaki', 'Sesame'],
    nutrition: { cal: 550, protein: 42, carbs: 55, fat: 16 },
    tags: ['high-protein'],
    rating: 4.6,
    reviews: 142,
    color: '#B8863E',
  },
  {
    id: 'shrimp-mango',
    name: 'Shrimp & Mango',
    category: 'poke',
    price: 92000,
    image: 'assets/img/shrimp-mango.jfif',
    description: 'Grilled tiger shrimp with fresh mango, avocado, red cabbage slaw, and zesty cilantro lime dressing.',
    ingredients: ['Shrimp', 'Mango', 'Avocado', 'Red Cabbage', 'Mixed Greens', 'Lime Dressing'],
    nutrition: { cal: 460, protein: 32, carbs: 42, fat: 16 },
    tags: ['high-protein'],
    rating: 4.8,
    reviews: 98,
    color: '#E8A94D',
  },
  {
    id: 'ocean-omega',
    name: 'Ocean Omega',
    category: 'poke',
    price: 95000,
    image: 'assets/img/ocean-omega.jfif',
    description: 'Double protein bowl with salmon and tuna, avocado, seaweed salad, pickled ginger, wasabi ponzu.',
    ingredients: ['Salmon', 'Tuna', 'Avocado', 'Seaweed', 'Ginger', 'Wasabi Ponzu'],
    nutrition: { cal: 580, protein: 48, carbs: 38, fat: 22 },
    tags: ['high-protein', 'popular'],
    rating: 4.9,
    reviews: 167,
    color: '#8B5E3C',
  },

  // ── Salads ──
  {
    id: 'power-greens',
    name: 'Power Greens',
    category: 'salad',
    price: 72000,
    image: 'assets/img/power-greens.jfif',
    description: 'Kale and spinach base with grilled chicken, quinoa, roasted sweet potato, and tahini dressing.',
    ingredients: ['Kale', 'Spinach', 'Chicken', 'Quinoa', 'Sweet Potato', 'Tahini'],
    nutrition: { cal: 450, protein: 35, carbs: 40, fat: 18 },
    tags: ['high-protein'],
    rating: 4.6,
    reviews: 123,
    color: '#4F6E3B',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean Bowl',
    category: 'salad',
    image: 'assets/img/Mediterranean-bowl.jfif',
    price: 68000,
    description: 'Mixed greens, cherry tomatoes, feta, kalamata olives, cucumber, grilled halloumi, herb vinaigrette.',
    ingredients: ['Greens', 'Tomato', 'Feta', 'Olives', 'Halloumi', 'Herb Vinaigrette'],
    nutrition: { cal: 380, protein: 18, carbs: 28, fat: 24 },
    tags: ['vegetarian'],
    rating: 4.5,
    reviews: 89,
    color: '#A67B5B',
  },
  {
    id: 'salmon-salad',
    name: 'Grilled Salmon Salad',
    category: 'salad',
    price: 88000,
    image: 'assets/img/salmon-salad.jfif',
    description: 'Pan-seared salmon, mixed greens, soft-boiled egg, avocado, cherry tomato, light citrus dressing.',
    ingredients: ['Salmon', 'Egg', 'Avocado', 'Cherry Tomato', 'Greens', 'Citrus Dressing'],
    nutrition: { cal: 490, protein: 40, carbs: 18, fat: 28 },
    tags: ['high-protein', 'low-calorie'],
    rating: 4.8,
    reviews: 145,
    color: '#C77B4E',
  },

  // ── Drinks ──
  {
    id: 'green-detox',
    name: 'Green Detox',
    category: 'drinks',
    price: 38000,
    image: 'assets/img/green-detox.jfif',
    description: 'Cold-pressed spinach, green apple, cucumber, ginger, and fresh lemon.',
    ingredients: ['Spinach', 'Apple', 'Cucumber', 'Ginger', 'Lemon'],
    nutrition: { cal: 120, protein: 3, carbs: 28, fat: 1 },
    tags: ['low-calorie'],
    rating: 4.5,
    reviews: 78,
    color: '#7A9B6E',
  },
  {
    id: 'mango-passion',
    name: 'Mango Passion',
    category: 'drinks',
    price: 42000,
    image: 'assets/img/mango-passion.jfif',
    description: 'Blended mango, passionfruit, Greek yogurt, and a touch of honey.',
    ingredients: ['Mango', 'Passionfruit', 'Greek Yogurt', 'Honey'],
    nutrition: { cal: 210, protein: 8, carbs: 42, fat: 3 },
    tags: ['popular'],
    rating: 4.7,
    reviews: 112,
    color: '#E8A94D',
  },
  {
    id: 'berry-protein',
    name: 'Berry Protein Shake',
    category: 'drinks',
    price: 45000,
    image: 'assets/img/berry-shake.jfif',
    description: 'Mixed berries, banana, whey protein, oat milk, almond butter.',
    ingredients: ['Mixed Berries', 'Banana', 'Whey Protein', 'Oat Milk', 'Almond Butter'],
    nutrition: { cal: 320, protein: 28, carbs: 35, fat: 10 },
    tags: ['high-protein'],
    rating: 4.6,
    reviews: 94,
    color: '#9B4D7A',
  },
  {
    id: 'coconut-water',
    name: 'Young Coconut',
    category: 'drinks',
    price: 28000,
    image: 'assets/img/young-coconut.jfif',
    description: 'Fresh young coconut water served chilled with tender coconut flesh.',
    ingredients: ['Young Coconut'],
    nutrition: { cal: 60, protein: 1, carbs: 14, fat: 0 },
    tags: ['low-calorie'],
    rating: 4.4,
    reviews: 67,
    color: '#D4C5A9',
  },

  // ── Seasonal ──
  {
    id: 'truffle-salmon',
    name: 'Truffle Salmon Bowl',
    category: 'seasonal',
    price: 115000,
    image: 'assets/img/truffle-salmon.jfif',
    description: 'Premium Norwegian salmon, truffle-infused soy glaze, ikura, shiso leaf, sushi rice. Limited edition.',
    ingredients: ['Premium Salmon', 'Truffle Soy', 'Ikura', 'Shiso', 'Sushi Rice', 'Sesame'],
    nutrition: { cal: 540, protein: 42, carbs: 44, fat: 20 },
    tags: ['seasonal', 'high-protein', 'popular'],
    rating: 4.9,
    reviews: 45,
    color: '#7A5C3C',
    badge: 'Limited',
  },
  {
    id: 'autumn-harvest',
    name: 'Autumn Harvest Bowl',
    category: 'seasonal',
    price: 82000,
    image: 'assets/img/autumn-harvest.jfif',
    description: 'Roasted pumpkin, quinoa, grilled chicken, dried cranberries, warm maple tahini dressing.',
    ingredients: ['Pumpkin', 'Quinoa', 'Chicken', 'Cranberries', 'Maple Tahini'],
    nutrition: { cal: 510, protein: 32, carbs: 58, fat: 16 },
    tags: ['seasonal', 'high-protein'],
    rating: 4.7,
    reviews: 38,
    color: '#C4793D',
    badge: 'Seasonal',
  },
];

/* ----------------------------------------------------------------
   MENU CATEGORIES
   ---------------------------------------------------------------- */
const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'grid' },
  { id: 'poke', name: 'Poke', icon: 'pokebowl' },
  { id: 'salad', name: 'Salad', icon: 'salad' },
  { id: 'drinks', name: 'Drinks', icon: 'cup' },
  { id: 'seasonal', name: 'Seasonal', icon: 'leaf' },
];

const FILTER_TAGS = [
  { id: 'popular', name: 'Popular' },
  { id: 'high-protein', name: 'High Protein' },
  { id: 'vegetarian', name: 'Vegetarian' },
  { id: 'spicy', name: 'Spicy' },
  { id: 'low-calorie', name: 'Low Calorie' },
];

// =========================================================
// BUILD YOUR BOWL
// =========================================================

const BOWL_STEPS = {

  base: {
    id: 'base',
    title: 'Choose Your Base',
    options: [
      {
        id: 'brown-rice',
        name: 'Brown Rice',
        description: 'Nutty, wholesome and filling.',
        price: 0,
        cal: 210,
        protein: 5,
        color: '#B58B62',
        emoji: '🍚',
        image: 'assets/img/brown-rice.JPG'
      },
      {
        id: 'white-rice',
        name: 'Sushi Rice',
        description: 'Soft and lightly seasoned.',
        price: 0,
        cal: 220,
        protein: 4,
        color: '#E8E2D5',
        emoji: '🍚',
        image : 'assets/img/sushi-rice.JPG'
      },
      {
        id: 'mixed-greens',
        name: 'Mixed Greens',
        description: 'Fresh greens for a lighter bowl.',
        price: 5000,
        cal: 80,
        protein: 3,
        color: '#78905F',
        emoji: '🥬',
        image: 'assets/img/mixed-green.JPG'
      }
    ]
  },

  protein: {
    id: 'protein',
    title: 'Choose Your Protein',
    multiple: true,
    maxSelection: 3,
    options: [
      {
        id: 'tuna',
        name: 'Tuna',
        description: 'Fresh premium tuna.',
        price: 30000,
        cal: 140,
        protein: 30,
        color: '#B95757',
        emoji: '🐟',
        image: 'assets/img/tuna.JPG'
      },
      {
        id: 'salmon',
        name: 'Salmon',
        description: 'Rich, fresh Atlantic salmon.',
        price: 35000,
        cal: 180,
        protein: 28,
        color: '#D98268',
        emoji: '🍣',
        image: 'assets/img/salmon.JPG'
      },
      {
        id: 'chicken',
        name: 'Chicken',
        description: 'Tender grilled chicken breast.',
        price: 25000,
        cal: 165,
        protein: 31,
        color: '#C8A47A',
        emoji: '🍗',
        image: 'assets/img/chicken.JPG'

      },
      {
        id: 'tofu',
        name: 'Tofu',
        description: 'Plant-based protein.',
        price: 18000,
        cal: 120,
        protein: 14,
        color: '#E6DCC5',
        emoji: '🥢',
        image: 'assets/img/tofu.JPG'
      }
    ]
  },

  toppings: {
    id: 'toppings',
    title: 'Choose Your Toppings',
    options: [
      {
        id: 'edamame',
        name: 'Edamame',
        description: 'Fresh green soybeans.',
        price: 8000,
        cal: 60,
        protein: 6,
        color: '#789C55',
        emoji: '🫛',
        image: 'assets/img/edamame.JPG'
      },
      {
        id: 'cucumber',
        name: 'Cucumber',
        description: 'Cool and refreshing.',
        price: 5000,
        cal: 15,
        protein: 1,
        color: '#91B86A',
        emoji: '🥒',
        image: 'assets/img/cucumber.JPG'
      },
      {
        id: 'avocado',
        name: 'Avocado',
        description: 'Creamy and nutrient-rich.',
        price: 10000,
        cal: 80,
        protein: 1,
        color: '#8A9B57',
        emoji: '🥑',
        image: 'assets/img/avocado.JPG'
      },
      {
        id: 'carrot',
        name: 'Carrot',
        description: 'Fresh and naturally sweet.',
        price: 5000,
        cal: 25,
        protein: 1,
        color: '#D88942',
        emoji: '🥕',
        image: 'assets/img/carrot.JPG'
      },
      {
        id: 'corn',
        name: 'Sweet Corn',
        description: 'A little sweetness and crunch.',
        price: 5000,
        cal: 45,
        protein: 2,
        color: '#D8B64B',
        emoji: '🌽',
        image: 'assets/img/corn.JPG'
      }
    ]
  },

  sauce: {
    id: 'sauce',
    title: 'Choose Your Sauce',
    options: [
      {
        id: 'ponzu',
        name: 'Ponzu Sauce',
        description: 'Bright, citrusy and refreshing.',
        price: 5000,
        cal: 35,
        protein: 0,
        color: '#292A23',
        emoji: '🥣',
        image: 'assets/img/ponzu-sauce.JPG'
      },
      {
        id: 'sesame',
        name: 'Sesame Sauce',
        description: 'Creamy with a nutty finish.',
        price: 7000,
        cal: 90,
        protein: 2,
        color: '#B89568',
        emoji: '🥣',
        image: 'assets/img/sesame-seed-sauce.JPG'
      },
      {
        id: 'spicy-mayo',
        name: 'Spicy Mayo',
        description: 'Creamy with a gentle kick.',
        price: 7000,
        cal: 100,
        protein: 1,
        color: '#C9655D',
        emoji: '🌶️',
        image: 'assets/img/spicy-mayo.JPG'
      }
    ]
  },

  extras: {
    id: 'extras',
    title: 'Add Extras',
    options: [
      {
        id: 'seaweed',
        name: 'Seaweed',
        description: 'Crispy roasted seaweed.',
        price: 5000,
        cal: 15,
        protein: 1,
        color: '#303C2C',
        emoji: '🌿',
        image: 'assets/img/seaweed.JPG'
      },
      {
        id: 'sesame-seeds',
        name: 'Sesame Seeds',
        description: 'Toasted for extra crunch.',
        price: 3000,
        cal: 20,
        protein: 1,
        color: '#D8C59D',
        emoji: '✨',
        image: 'assets/img/sesame-seed.JPG'
      },
      {
        id: 'soft-egg',
        name: 'Soft Egg',
        description: 'Creamy egg with a soft center.',
        price: 10000,
        cal: 70,
        protein: 6,
        color: '#E7C65A',
        emoji: '🥚',
        image: 'assets/img/egg.JPG'
      }
    ]
  }

};

/* ----------------------------------------------------------------
   SIGNATURE BOWLS (curated for homepage)
   ---------------------------------------------------------------- */
const SIGNATURE_BOWLS = ['salmon-umami', 'spicy-tuna', 'green-harvest'];

/* ----------------------------------------------------------------
   MEMBERSHIP / FARSLY CLUB
   ---------------------------------------------------------------- */

const MEMBERSHIP = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 0,
    period: 'Free',
    description: 'For occasional healthy cravings',
    details:
      'The starting plan for anyone who orders from Farsly now and then. No cost, no commitment — just sign up and start earning.',
    pointsRate: 1,
    discount: 0,
    benefits: [
      'Earn 1 point for every Rp 10.000 spent',
      'A birthday treat, on us',
      'Exclusive member updates on new menu items and promos'
    ],
    button: 'Current Plan',
    popular: false
  },

  premium: {
    id: 'premium',
    name: 'Premium',
    price: 49000,
    period: '/month',
    description: 'For those who eat healthy, regularly',
    details:
      'Built for regulars — faster points, real savings on every order, and first access before things go public.',
    pointsRate: 2,
    discount: 5,
    benefits: [
      'Earn 2 points for every Rp 10.000 spent',
      '5% off all orders, automatically applied',
      'Early access to new menu items before general release',
      'Invitations to exclusive member events'
    ],
    button: 'Upgrade',
    popular: true
  },

  vip: {
    id: 'vip',
    name: 'VIP',
    price: 99000,
    period: '/month',
    description: 'For our most valued members',
    details:
      'The full Farsly experience — the fastest point earning, the deepest discount, and perks that go beyond just food.',
    pointsRate: 3,
    discount: 10,
    benefits: [
      'Earn 3 points for every Rp 10.000 spent',
      '10% off all orders, automatically applied',
      'Early access to new menu items before general release',
      'Invitations to exclusive member events',
      'A free birthday bowl, on the house'
    ],
    button: 'Upgrade',
    popular: false
  }
};

/* ----------------------------------------------------------------
   TESTIMONIALS
   ---------------------------------------------------------------- */
const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    role: 'Fitness Enthusiast',
    text: "Farsly changed how I eat. The Build Your Bowl feature means I get exactly the macros I need, and it actually tastes incredible.",
    rating: 5,
  },
  {
    name: 'Daniel R.',
    role: 'Office Worker',
    text: "Finally, a lunch spot that doesn't make me feel sluggish at 3pm. The Salmon Umami is my go-to — fresh every single time.",
    rating: 5,
  },
  {
    name: 'Mira A.',
    role: 'University Student',
    text: "I love that I can see the nutrition info for everything. As a vegetarian, the Green Harvest bowl is perfection.",
    rating: 5,
  },
];

/* ----------------------------------------------------------------
   FIND YOUR BOWL — QUIZ
   ---------------------------------------------------------------- */
const BOWL_QUIZ = {
  question: "What are you in the mood for?",
  options: [
    {
      id: 'high-protein',
      label: 'High Protein',
      emoji: '💪',
      description: 'Fuel your body',
      results: ['salmon-umami', 'ocean-omega', 'chicken-teriyaki'],
    },
    {
      id: 'light-fresh',
      label: 'Light & Fresh',
      emoji: '🥬',
      description: 'Keep it clean',
      results: ['green-harvest', 'mediterranean', 'power-greens'],
    },
    {
      id: 'spicy',
      label: 'Something Spicy',
      emoji: '🌶️',
      description: 'Bring the heat',
      results: ['spicy-tuna', 'shrimp-mango', 'chicken-teriyaki'],
    },
    {
      id: 'post-workout',
      label: 'Post-Workout',
      emoji: '🏋️',
      description: 'Recover & rebuild',
      results: ['ocean-omega', 'salmon-umami', 'berry-protein'],
    },
    {
      id: 'vegetarian',
      label: 'Vegetarian',
      emoji: '🌱',
      description: 'Plant-powered',
      results: ['green-harvest', 'mediterranean', 'green-detox'],
    },
    {
      id: 'adventurous',
      label: 'Feeling Adventurous',
      emoji: '✨',
      description: 'Surprise me',
      results: ['truffle-salmon', 'shrimp-mango', 'autumn-harvest'],
    },
  ],
};

/* ----------------------------------------------------------------
   FARM TO BOWL STORY
   ---------------------------------------------------------------- */
const FARM_STORY = [
  { icon: 'leaf', title: 'Local Farms', text: 'Sourced from trusted local and sustainable farms' },
  { icon: 'check', title: 'Hand-Selected', text: 'Every ingredient inspected for freshness and quality' },
  { icon: 'fire', title: 'Premium Protein', text: 'Sashimi-grade fish, free-range chicken, organic tofu' },
  { icon: 'bowl', title: 'Crafted Fresh', text: 'Prepared in our kitchen the moment you order' },
];

/* ----------------------------------------------------------------
   PROMO / SEASONAL
   ---------------------------------------------------------------- */
const SEASONAL_PROMO = {
  title: 'Truffle Season',
  subtitle: 'Limited Edition',
  description: 'Our Truffle Salmon Bowl is back for a limited time. Premium Norwegian salmon with house-made truffle soy glaze.',
  itemId: 'truffle-salmon',
  badge: 'Limited Time',
};

/* ----------------------------------------------------------------
   FAQ
   ---------------------------------------------------------------- */
const FAQS = [
  { q: 'How does the Build Your Bowl work?', a: 'Choose your base, protein, toppings, sauce, and extras step by step. Your bowl is prepared fresh the moment your order is confirmed. You can save your custom creations for easy reordering.' },
  { q: 'How do I earn Farsly Club points?', a: 'Every order earns points based on your tier — Green earns 1 point per Rp 10.000 spent, Gold earns 1.5×, and Platinum earns 2×. Points are added to your account as soon as checkout is confirmed.' },
  { q: 'Can I modify a menu bowl?', a: 'Yes. Tap "Customize" on any menu item to swap ingredients, add extras, or adjust portions before adding to cart.' },
  { q: 'Is there a minimum order for delivery?', a: 'No minimum — order a single smoothie or a full spread, delivery fee is calculated the same way.' },
  { q: 'Do unused points expire?', a: 'Points stay on your account as long as you place at least one order every 12 months.' },
  { q: 'How do I redeem rewards?', a: 'Go to Farsly Club, browse available rewards, and tap Redeem. The reward is applied to your next order automatically.' },
];


const BUILD_BOWL_IMAGES = {
    0: "assets/img/bowl-base.png",
    1: "assets/img/bowl-protein.png",
    2: "assets/img/bowl-toppings.png",
    3: "assets/img/bowl-sauce.png",
    4: "assets/img/bowl-extras.png",
    5: "assets/img/bowl-final.png"
};