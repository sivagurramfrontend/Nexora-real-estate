/**
 * Nexora demo content
 * ---------------------------------------------------------------------------
 * Every property, agent and blog post on the site comes from this file.
 * Edit the arrays below to change the content — no other file needs touching.
 *
 * Image paths are relative to the HTML pages (the site root).
 * Replace the files in assets/images/ with your own photos, keeping the
 * same file names, or update the paths here.
 *
 * Property fields
 *   id          Unique number. Used in the URL: property-details.html?id=1
 *   status      "Sale" or "Rent"
 *   type        Apartment | Villa | House | Commercial | Land
 *   price       Number. For rentals this is the monthly rent.
 *   lat / lng   Coordinates used for the map on the detail page.
 *   featured    true = shown in "Featured Properties" on the home pages.
 *   agentId     Must match an id in NexoraData.agents.
 */
window.NexoraData = {

  properties: [
    {
      id: 1, title: "Modern Family Villa", type: "Villa", status: "Sale", price: 850000,
      location: "Los Angeles, CA", address: "1200 Sunset Hills Dr", lat: 34.0928, lng: -118.3287,
      beds: 4, baths: 3, area: 2800, year: 2024, featured: true, agentId: 1,
      image: "assets/images/property-modern-villa.svg",
      images: [
        "assets/images/property-modern-villa.svg", "assets/images/property-modern-villa-2.svg",
        "assets/images/property-modern-villa-3.svg", "assets/images/property-modern-villa-4.svg"
      ],
      description: "A refined family villa combining generous living areas, contemporary finishes and a private pool terrace. Designed as a polished demo listing for the template.",
      amenities: ["Private garden", "2-car garage", "Smart home", "Open kitchen", "Walk-in closets", "Outdoor lounge"]
    },
    {
      id: 2, title: "Luxury City Apartment", type: "Apartment", status: "Rent", price: 2500,
      location: "New York, NY", address: "88 Madison Avenue", lat: 40.7484, lng: -73.9857,
      beds: 2, baths: 2, area: 1200, year: 2023, featured: true, agentId: 2,
      image: "assets/images/property-city-apartment.svg",
      images: [
        "assets/images/property-city-apartment.svg", "assets/images/property-city-apartment-2.svg",
        "assets/images/property-city-apartment-3.svg", "assets/images/property-city-apartment-4.svg"
      ],
      description: "A bright city apartment with an efficient floor plan, premium materials and easy access to urban amenities.",
      amenities: ["City views", "Fitness room", "Concierge", "Parking", "Rooftop access", "Pet friendly"]
    },
    {
      id: 3, title: "Elegant Modern House", type: "House", status: "Sale", price: 620000,
      location: "Austin, TX", address: "47 Lakeview Court", lat: 30.2672, lng: -97.7431,
      beds: 3, baths: 2, area: 2100, year: 2022, featured: true, agentId: 3,
      image: "assets/images/property-modern-house.svg",
      images: [
        "assets/images/property-modern-house.svg", "assets/images/property-modern-house-2.svg",
        "assets/images/property-modern-house-3.svg", "assets/images/property-modern-house-4.svg"
      ],
      description: "A clean-lined modern home with flexible living space, natural light and a practical family layout.",
      amenities: ["Large patio", "Home office", "Garage", "Quartz counters", "Laundry room", "Energy efficient"]
    },
    {
      id: 4, title: "Ocean View Villa", type: "Villa", status: "Sale", price: 1250000,
      location: "Miami, FL", address: "9 Coral Way", lat: 25.7617, lng: -80.1918,
      beds: 5, baths: 4, area: 3500, year: 2025, featured: true, agentId: 4,
      image: "assets/images/property-ocean-villa.svg",
      images: [
        "assets/images/property-ocean-villa.svg", "assets/images/property-ocean-villa-2.svg",
        "assets/images/property-ocean-villa-3.svg", "assets/images/property-ocean-villa-4.svg"
      ],
      description: "A coastal villa concept with expansive spaces, resort-style details and panoramic water views.",
      amenities: ["Pool", "Ocean view", "Guest suite", "Outdoor kitchen", "Security system", "3-car garage"]
    },
    {
      id: 5, title: "Downtown Business Suite", type: "Commercial", status: "Rent", price: 4800,
      location: "Chicago, IL", address: "300 W Adams Street", lat: 41.8781, lng: -87.6298,
      beds: 0, baths: 2, area: 2400, year: 2021, featured: false, agentId: 2,
      image: "assets/images/property-business-suite.svg",
      images: [
        "assets/images/property-business-suite.svg", "assets/images/property-business-suite-2.svg",
        "assets/images/property-business-suite-3.svg", "assets/images/property-business-suite-4.svg"
      ],
      description: "A flexible commercial suite suitable for a boutique office, studio or client-facing business.",
      amenities: ["Reception area", "Meeting rooms", "High-speed internet", "Parking", "Security", "Elevator"]
    },
    {
      id: 6, title: "Green Valley Family Home", type: "House", status: "Sale", price: 475000,
      location: "Denver, CO", address: "22 Aspen Ridge Road", lat: 39.7392, lng: -104.9903,
      beds: 3, baths: 2, area: 1950, year: 2020, featured: false, agentId: 1,
      image: "assets/images/property-family-home.svg",
      images: [
        "assets/images/property-family-home.svg", "assets/images/property-family-home-2.svg",
        "assets/images/property-family-home-3.svg", "assets/images/property-family-home-4.svg"
      ],
      description: "A welcoming suburban home with a balanced mix of private and shared spaces.",
      amenities: ["Fenced yard", "Garage", "Fireplace", "Deck", "Storage", "Home office"]
    },
    {
      id: 7, title: "Riverside Investment Plot", type: "Land", status: "Sale", price: 290000,
      location: "Nashville, TN", address: "Riverside Road, Lot 14", lat: 36.1627, lng: -86.7816,
      beds: 0, baths: 0, area: 7200, year: 2026, featured: false, agentId: 4,
      image: "assets/images/property-plot.svg",
      images: [
        "assets/images/property-plot.svg", "assets/images/property-plot-2.svg",
        "assets/images/property-plot-3.svg", "assets/images/property-plot-4.svg"
      ],
      description: "A land listing that shows how the template handles investment plots with no bedrooms or bathrooms.",
      amenities: ["Road access", "Utilities nearby", "Development potential", "Survey available"]
    },
    {
      id: 8, title: "Parkside Rental Home", type: "House", status: "Rent", price: 3200,
      location: "Seattle, WA", address: "15 Maple Park Lane", lat: 47.6062, lng: -122.3321,
      beds: 3, baths: 2, area: 1800, year: 2023, featured: false, agentId: 3,
      image: "assets/images/property-rental-home.svg",
      images: [
        "assets/images/property-rental-home.svg", "assets/images/property-rental-home-2.svg",
        "assets/images/property-rental-home-3.svg", "assets/images/property-rental-home-4.svg"
      ],
      description: "A polished rental home with a practical layout and a park-adjacent setting.",
      amenities: ["Garden", "Garage", "Pet friendly", "Laundry", "Deck", "Storage"]
    },
    {
      id: 9, title: "Skyline Penthouse", type: "Apartment", status: "Sale", price: 1480000,
      location: "New York, NY", address: "1 Hudson Yards, PH2", lat: 40.7536, lng: -74.0016,
      beds: 3, baths: 3, area: 2200, year: 2025, featured: false, agentId: 2,
      image: "assets/images/property-city-apartment-4.svg",
      images: [
        "assets/images/property-city-apartment-4.svg", "assets/images/property-city-apartment-3.svg",
        "assets/images/property-city-apartment-2.svg", "assets/images/property-city-apartment.svg"
      ],
      description: "A top-floor penthouse with wraparound terraces and floor-to-ceiling glazing above the city.",
      amenities: ["Private terrace", "Concierge", "Wine room", "Gym access", "Valet parking", "Smart home"]
    },
    {
      id: 10, title: "Palm Court Villa", type: "Villa", status: "Rent", price: 6800,
      location: "Miami, FL", address: "410 Palm Court", lat: 25.7907, lng: -80.13,
      beds: 4, baths: 3, area: 3100, year: 2022, featured: false, agentId: 4,
      image: "assets/images/property-modern-villa-2.svg",
      images: [
        "assets/images/property-modern-villa-2.svg", "assets/images/property-modern-villa-4.svg",
        "assets/images/property-modern-villa-3.svg", "assets/images/property-modern-villa.svg"
      ],
      description: "A furnished rental villa with a heated pool, shaded courtyards and a short walk to the beach.",
      amenities: ["Heated pool", "Furnished", "Courtyard", "Garage", "Outdoor shower", "Wi-Fi"]
    },
    {
      id: 11, title: "Hillcrest Retail Unit", type: "Commercial", status: "Sale", price: 735000,
      location: "Austin, TX", address: "700 Congress Avenue", lat: 30.2711, lng: -97.7437,
      beds: 0, baths: 2, area: 3000, year: 2019, featured: false, agentId: 3,
      image: "assets/images/property-business-suite-2.svg",
      images: [
        "assets/images/property-business-suite-2.svg", "assets/images/property-business-suite.svg",
        "assets/images/property-business-suite-4.svg", "assets/images/property-business-suite-3.svg"
      ],
      description: "A street-level retail unit with high footfall, large display windows and flexible fit-out options.",
      amenities: ["Street frontage", "Storage room", "Loading bay", "Alarm system", "Air conditioning"]
    },
    {
      id: 12, title: "Sunset Acres Lot", type: "Land", status: "Sale", price: 185000,
      location: "Denver, CO", address: "Sunset Acres, Lot 3", lat: 39.6, lng: -105.05,
      beds: 0, baths: 0, area: 9800, year: 2026, featured: false, agentId: 1,
      image: "assets/images/property-plot-2.svg",
      images: [
        "assets/images/property-plot-2.svg", "assets/images/property-plot-3.svg",
        "assets/images/property-plot-4.svg", "assets/images/property-plot.svg"
      ],
      description: "A gently sloping lot with mountain views, ready for a custom build.",
      amenities: ["Mountain views", "Utilities at street", "Cleared lot", "Survey available"]
    }
  ],

  agents: [
    {
      id: 1, name: "Sarah Johnson", role: "Senior Agent", location: "Los Angeles, CA",
      email: "sarah@example.com", phone: "+1 234 567 890", image: "assets/images/avatar-sarah.svg",
      bio: "Sarah helps families find homes they will love, with a focus on residential sales and relocation. Replace this text with your own team information.",
      specialties: ["Residential sales", "Luxury homes", "Relocation"]
    },
    {
      id: 2, name: "Michael Chen", role: "Property Consultant", location: "New York, NY",
      email: "michael@example.com", phone: "+1 234 567 891", image: "assets/images/avatar-michael.svg",
      bio: "Michael advises renters, landlords and small businesses on city apartments and commercial space. Replace this text with your own team information.",
      specialties: ["Rentals", "Commercial", "Investments"]
    },
    {
      id: 3, name: "Emily Davis", role: "Luxury Specialist", location: "Austin, TX",
      email: "emily@example.com", phone: "+1 234 567 892", image: "assets/images/avatar-emily.svg",
      bio: "Emily specialises in design-led homes and new developments. Replace this text with your own team information.",
      specialties: ["Luxury homes", "New developments", "Sales"]
    },
    {
      id: 4, name: "James Wilson", role: "Investment Advisor", location: "Miami, FL",
      email: "james@example.com", phone: "+1 234 567 893", image: "assets/images/avatar-james.svg",
      bio: "James guides buyers through land purchases and coastal investment properties. Replace this text with your own team information.",
      specialties: ["Land", "Investments", "Commercial"]
    }
  ],

  posts: [
    {
      id: 1, title: "How to Choose the Right Neighborhood", date: "2026-06-12", category: "Buying Guide",
      image: "assets/images/property-modern-house.svg",
      excerpt: "A practical framework for comparing location, lifestyle, commute and long-term value.",
      body: [
        "Choosing a neighborhood is about more than the property itself. Start by listing the factors that matter most to your household.",
        "Compare daily convenience, transport, schools, amenities and the character of the area before narrowing down individual properties.",
        "Finally, revisit your shortlist at different times of day so your decision reflects real-world conditions."
      ]
    },
    {
      id: 2, title: "Smart Ways to Prepare a Home for Sale", date: "2026-05-28", category: "Selling",
      image: "assets/images/interior.svg",
      excerpt: "Simple presentation and preparation steps that can make a listing easier to market.",
      body: [
        "Start with a clean, uncluttered presentation. Buyers need to understand the space quickly when viewing photos online.",
        "Repair obvious maintenance issues and make sure important information is easy to access.",
        "Use consistent photography and clear listing copy so the property feels trustworthy across every channel."
      ]
    },
    {
      id: 3, title: "Rental Investment Basics", date: "2026-05-09", category: "Investment",
      image: "assets/images/property-business-suite.svg",
      excerpt: "Key numbers to review before evaluating a rental property as an investment.",
      body: [
        "Review expected rent, vacancy assumptions, operating costs and financing before estimating returns.",
        "Stress-test your numbers with conservative assumptions rather than relying on a single optimistic scenario.",
        "Keep your calculations and supporting documents organised so the investment thesis can be reviewed later."
      ]
    },
    {
      id: 4, title: "What to Check Before Buying Land", date: "2026-04-21", category: "Buying Guide",
      image: "assets/images/property-plot.svg",
      excerpt: "Zoning, access, utilities and surveys: the checks that protect a land purchase.",
      body: [
        "Confirm zoning and permitted use first. A plot that looks perfect may not allow the building you have in mind.",
        "Check legal road access and how far utilities are from the boundary, since connection costs vary widely.",
        "Order a current survey so boundaries, easements and slopes are documented before you commit."
      ]
    },
    {
      id: 5, title: "Renting vs Buying: Running the Numbers", date: "2026-03-30", category: "Market Insight",
      image: "assets/images/property-city-apartment.svg",
      excerpt: "A simple way to compare the monthly and long-term cost of renting and owning.",
      body: [
        "Compare the full monthly cost of owning, including mortgage, insurance, taxes and maintenance, against your current rent.",
        "Think about how long you plan to stay. Buying costs are easier to recover over a longer period.",
        "Keep an emergency fund separate from your down payment so one repair does not become a crisis."
      ]
    },
    {
      id: 6, title: "Designing a Home Office That Works", date: "2026-03-11", category: "Lifestyle",
      image: "assets/images/property-family-home-3.svg",
      excerpt: "Light, storage and acoustics: small decisions that make working from home easier.",
      body: [
        "Place your desk near natural light but avoid glare on your screen. Side lighting is usually the most comfortable.",
        "Plan storage first. A tidy surface makes a small room feel larger and helps you switch off at the end of the day.",
        "If the room is shared, soft furnishings such as rugs and curtains reduce echo on calls."
      ]
    }
  ]
};
