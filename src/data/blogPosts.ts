export interface BlogPost {
  id: string | number
  title: string
  excerpt: string
  image: string
  category: string
  author: {
    name: string
    avatar: string
    bio?: string
    social?: {
      facebook?: string
      twitter?: string
      instagram?: string
    }
  }
  date: string
  readTime: string
  featured?: boolean
  tags: string[]
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Top 10 Scenic Routes for Motorbike Tours in Vietnam',
    excerpt: 'Discover the most breathtaking routes from Ha Giang Loop to Hai Van Pass. Experience Vietnam\'s stunning landscapes on two wheels.',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&h=800&fit=crop',
    category: 'Destinations',
    author: {
      name: 'Quang Nguyen',
      avatar: 'https://ui-avatars.com/api/?name=Quang+Nguyen&background=FF6B35&color=fff',
      bio: 'Travel enthusiast and motorbike tour guide with 10+ years of experience exploring Vietnam.',
      social: {
        facebook: '#',
        twitter: '#',
        instagram: '#'
      }
    },
    date: '2025-11-15',
    readTime: '8 min read',
    featured: true,
    tags: ['Motorbike', 'Vietnam', 'Routes', 'Travel', 'Adventure'],
    content: `
      <h2 class="text-3xl font-bold text-gray-800 mt-12 mb-6">Introduction to Vietnam's Most Scenic Routes</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">Vietnam offers some of the most spectacular motorbike routes in Southeast Asia. From winding mountain passes to coastal highways, each journey promises unforgettable experiences and breathtaking views.</p>
      
      <img src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&h=600&fit=crop" alt="Mountain road" class="w-full rounded-2xl shadow-lg my-10" />
      
      <h2 class="text-3xl font-bold text-gray-800 mt-12 mb-6">1. Ha Giang Loop - The Ultimate Mountain Adventure</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">The Ha Giang Loop is arguably Vietnam's most famous motorbike route. This 350km circuit through the northern mountains takes you through stunning karst landscapes, ethnic minority villages, and some of the most dramatic scenery in the country.</p>
      
      <blockquote class="p-8 my-10 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl italic text-gray-700">
        <p class="mb-4 text-xl">"The Ha Giang Loop changed my perspective on travel. Every turn revealed a new wonder, and the local people's warmth made the journey truly special."</p>
        <cite class="block text-sm font-bold text-blue-600 not-italic">- Sarah Johnson, Travel Blogger</cite>
      </blockquote>
      
      <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Key Highlights:</h3>
      <ul class="list-disc pl-6 mb-8 text-gray-600 space-y-2">
        <li>Ma Pi Leng Pass - one of the "Four Great Passes" of Vietnam</li>
        <li>Dong Van Karst Plateau Geopark</li>
        <li>Lung Cu Flag Tower - Vietnam's northernmost point</li>
        <li>Traditional H'mong and Tay villages</li>
      </ul>
      
      <div class="p-6 my-8 bg-green-50 border border-green-200 rounded-xl">
        <strong class="text-green-700 block mb-2">Pro Tip:</strong> 
        <span class="text-green-800">The best time to visit Ha Giang is from September to November when the weather is dry and buckwheat flowers are in bloom.</span>
      </div>
      
      <h2 class="text-3xl font-bold text-gray-800 mt-12 mb-6">2. Hai Van Pass - The Ocean Cloud Pass</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">Connecting Da Nang and Hue, the Hai Van Pass is one of the most scenic coastal routes in Vietnam. The 21km road climbs to 496 meters above sea level, offering panoramic views of the coastline.</p>
      
      <img src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&h=600&fit=crop" alt="Hai Van Pass" class="w-full rounded-2xl shadow-lg my-10" />
      
      <h2 class="text-3xl font-bold text-gray-800 mt-12 mb-6">3. Ho Chi Minh Trail - Historical Journey</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">This legendary route offers a mix of history and natural beauty. Riding the Ho Chi Minh Trail takes you through Central Highlands, past waterfalls, coffee plantations, and historical sites.</p>
    `
  },
  {
    id: '2',
    title: 'Essential Safety Tips for Motorbike Adventures',
    excerpt: 'Stay safe on your journey with our comprehensive guide to motorbike safety in Vietnam. From gear to road rules.',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&h=800&fit=crop',
    category: 'Travel Tips',
    author: {
      name: 'Minh Tran',
      avatar: 'https://ui-avatars.com/api/?name=Minh+Tran&background=1A71C7&color=fff',
      bio: 'Safety instructor and mechanic with a passion for helping riders explore safely.',
    },
    date: '2025-11-12',
    readTime: '6 min read',
    featured: false,
    tags: ['Safety', 'Tips', 'Preparation', 'Gear'],
    content: `
      <h2 class="text-3xl font-bold text-gray-800 mt-12 mb-6">Safety First on Vietnam's Roads</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">Riding a motorbike in Vietnam is an exhilarating experience, but it comes with its unique set of challenges. Traffic can be chaotic, and road conditions vary. Here is how to stay safe.</p>
      
      <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Wear Proper Gear</h3>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">Never compromise on your helmet. A full-face helmet is best for long tours. Wear gloves, long pants, and sturdy shoes. Flip-flops are a big no-no.</p>
      
      <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Understand Local Traffic Rules</h3>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">In Vietnam, size matters. Trucks and buses often take priority simply because they are bigger. Always yield to larger vehicles and be prepared for sudden stops.</p>
      
      <div class="p-6 my-8 bg-red-50 border border-red-200 rounded-xl">
        <strong class="text-red-700 block mb-2">Warning:</strong> 
        <span class="text-red-800">Be extremely careful at intersections. Traffic lights are sometimes ignored, especially in rural areas.</span>
      </div>
    `
  },
  {
    id: '3',
    title: 'Exploring Vietnamese Street Food on Your Tour',
    excerpt: 'A culinary journey through Vietnam\'s best street food spots. Must-try dishes and where to find them along popular routes.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=800&fit=crop',
    category: 'Food',
    author: {
      name: 'Lan Pham',
      avatar: 'https://ui-avatars.com/api/?name=Lan+Pham&background=FFA726&color=fff',
      bio: 'Food blogger and motorbike enthusiast. I ride to eat!',
    },
    date: '2025-11-10',
    readTime: '7 min read',
    featured: false,
    tags: ['Food', 'Culture', 'Street Food', 'Pho', 'Banh Mi'],
    content: `
      <h2 class="text-3xl font-bold text-gray-800 mt-12 mb-6">Taste of Vietnam</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">One of the best parts of a motorbike tour in Vietnam is the food. Every region has its own specialties, and the best way to discover them is by stopping at roadside stalls.</p>
      
      <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Must-Try Dishes</h3>
      <ul class="list-disc pl-6 mb-8 text-gray-600 space-y-2">
        <li><strong>Pho:</strong> The classic noodle soup, best enjoyed for breakfast in Hanoi.</li>
        <li><strong>Bun Cha:</strong> Grilled pork with noodles, a lunch favorite.</li>
        <li><strong>Banh Mi:</strong> The perfect on-the-go snack for riders.</li>
        <li><strong>Cao Lau:</strong> A unique noodle dish found only in Hoi An.</li>
      </ul>
    `
  },
  {
    id: '4',
    title: 'Ha Giang Loop: Complete Guide for First-Timers',
    excerpt: 'Everything you need to know about conquering the legendary Ha Giang Loop. Route details, best stops, and insider tips.',
    image: 'https://images.unsplash.com/photo-1625409677658-893093758e69?w=1200&h=800&fit=crop',
    category: 'Guides',
    author: {
      name: 'Quang Nguyen',
      avatar: 'https://ui-avatars.com/api/?name=Quang+Nguyen&background=FF6B35&color=fff'
    },
    date: '2025-11-08',
    readTime: '10 min read',
    featured: false,
    tags: ['Ha Giang', 'Guide', 'North Vietnam', 'Mountains'],
    content: `
      <h2 class="text-3xl font-bold text-gray-800 mt-12 mb-6">Planning Your Ha Giang Adventure</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">The Ha Giang Loop is not for the faint of heart, but it is incredibly rewarding. Here is what you need to know before you go.</p>
      
      <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Permits</h3>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">Foreigners need a permit to enter the border areas of Ha Giang. You can easily get this at the immigration office in Ha Giang city or ask your hotel to arrange it.</p>
    `
  },
  {
    id: '5',
    title: 'Understanding Vietnamese Culture Through Travel',
    excerpt: 'Immerse yourself in local traditions, customs, and etiquette. Connect deeper with Vietnam beyond the tourist trail.',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&h=800&fit=crop',
    category: 'Culture',
    author: {
      name: 'Hoa Le',
      avatar: 'https://ui-avatars.com/api/?name=Hoa+Le&background=D81B60&color=fff'
    },
    date: '2025-11-05',
    readTime: '9 min read',
    featured: false,
    tags: ['Culture', 'Tradition', 'Etiquette', 'People'],
    content: `
      <h2 class="text-3xl font-bold text-gray-800 mt-12 mb-6">More Than Just Scenery</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">Vietnam is a country rich in history and tradition. Taking the time to understand the local culture will enrich your travel experience significantly.</p>
      
      <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Basic Etiquette</h3>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">Dress modestly when visiting temples. Remove your shoes before entering a home. A smile goes a long way in overcoming language barriers.</p>
    `
  },
  {
    id: '6',
    title: 'Best Time to Visit Vietnam for Motorbike Tours',
    excerpt: 'Plan your perfect trip with our seasonal guide. Weather patterns, festivals, and optimal touring conditions.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&h=800&fit=crop',
    category: 'Travel Tips',
    author: {
      name: 'Minh Tran',
      avatar: 'https://ui-avatars.com/api/?name=Minh+Tran&background=1A71C7&color=fff'
    },
    date: '2025-11-01',
    readTime: '5 min read',
    featured: false,
    tags: ['Weather', 'Planning', 'Seasons', 'Tips'],
    content: `
      <h2 class="text-3xl font-bold text-gray-800 mt-12 mb-6">Weather Patterns</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">Vietnam is a long country with three distinct climate zones. While it might be sunny in the south, it could be freezing in the north.</p>
      
      <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">North Vietnam</h3>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">Best time: September to November and March to April. Winters can be cold and misty.</p>
    `
  },
  {
    id: '7',
    title: 'Hidden Gems of Central Vietnam',
    excerpt: 'Go off the beaten path in Central Vietnam. Discover ancient ruins, secluded beaches, and charming villages.',
    image: 'https://images.unsplash.com/photo-1565058788208-188626499483?w=1200&h=800&fit=crop',
    category: 'Destinations',
    author: {
      name: 'Quang Nguyen',
      avatar: 'https://ui-avatars.com/api/?name=Quang+Nguyen&background=FF6B35&color=fff'
    },
    date: '2025-10-28',
    readTime: '7 min read',
    featured: false,
    tags: ['Central Vietnam', 'Hidden Gems', 'Beach', 'History'],
    content: `
      <h2 class="text-3xl font-bold text-gray-800 mt-12 mb-6">Beyond Hue and Hoi An</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">While Hue and Hoi An are must-visits, the central coast has so much more to offer. Explore the My Son Sanctuary early in the morning to avoid crowds.</p>
    `
  },
  {
    id: '8',
    title: 'Packing List for a 2-Week Motorbike Trip',
    excerpt: 'Don\'t overpack! Here is the essential gear and clothing you need for a comfortable motorbike adventure.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&fit=crop',
    category: 'Travel Tips',
    author: {
      name: 'Minh Tran',
      avatar: 'https://ui-avatars.com/api/?name=Minh+Tran&background=1A71C7&color=fff'
    },
    date: '2025-10-25',
    readTime: '6 min read',
    featured: false,
    tags: ['Packing', 'Gear', 'Preparation', 'Tips'],
    content: `
      <h2 class="text-3xl font-bold text-gray-800 mt-12 mb-6">Pack Light, Travel Far</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">When you are on a bike, space is limited. Focus on quick-drying clothes and versatile layers.</p>
      
      <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Essentials</h3>
      <ul class="list-disc pl-6 mb-8 text-gray-600 space-y-2">
        <li>Rain gear (poncho and pants)</li>
        <li>First aid kit</li>
        <li>Power bank</li>
        <li>Sunscreen and sunglasses</li>
      </ul>
    `
  },
  {
    id: '9',
    title: 'Coffee Culture in Vietnam: A Rider\'s Guide',
    excerpt: 'From Egg Coffee in Hanoi to Salt Coffee in Hue. Discover the best coffee stops to fuel your ride.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&h=800&fit=crop',
    category: 'Food',
    author: {
      name: 'Lan Pham',
      avatar: 'https://ui-avatars.com/api/?name=Lan+Pham&background=FFA726&color=fff'
    },
    date: '2025-10-20',
    readTime: '5 min read',
    featured: false,
    tags: ['Coffee', 'Culture', 'Drink', 'Relax'],
    content: `
      <h2 class="text-3xl font-bold text-gray-800 mt-12 mb-6">Fuel for the Soul</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">Coffee is a way of life in Vietnam. Taking a break at a roadside cafe is an essential part of the riding experience.</p>
      
      <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Regional Specialties</h3>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">Don't miss the Egg Coffee (Ca Phe Trung) in Hanoi, a creamy delight. In the central region, try the Salt Coffee (Ca Phe Muoi) for a unique flavor profile.</p>
    `
  },
  {
    id: '10',
    title: 'Photography Tips for Motorbike Travelers',
    excerpt: 'Capture the beauty of Vietnam with these photography tips. Best angles, lighting, and gear for travel photography.',
    image: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=1200&h=800&fit=crop',
    category: 'Guides',
    author: {
      name: 'Hoa Le',
      avatar: 'https://ui-avatars.com/api/?name=Hoa+Le&background=D81B60&color=fff'
    },
    date: '2025-10-15',
    readTime: '8 min read',
    featured: false,
    tags: ['Photography', 'Tips', 'Art', 'Memories'],
    content: `
      <h2 class="text-3xl font-bold text-gray-800 mt-12 mb-6">Capturing the Moment</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">Vietnam is incredibly photogenic. To get the best shots, wake up early for the golden hour.</p>
      
      <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Composition</h3>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">Use the winding roads as leading lines in your photos. Include your bike in the shot to add a sense of adventure.</p>
    `
  }
]
