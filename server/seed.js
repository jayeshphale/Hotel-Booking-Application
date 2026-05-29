import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import connectDB from './config/db.js'
import User from './models/User.js'
import Hotel from './models/Hotel.js'
import Room from './models/Room.js'

dotenv.config()

const sampleHotels = [
  {
    name: 'Trinity Suites Bangalore',
    city: 'Bangalore',
    address: 'MG Road, Bangalore',
    description: 'Experience polished hospitality in the heart of Bangalore, with modern suites and an executive lounge.',
    amenities: ['Free WiFi', 'Pool', 'Gym', 'Spa', 'Rooftop bar'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.8,
    featured: true,
    startingPrice: 210,
    maxGuests: 4,
  },
  {
    name: 'Emerald Heights Resort',
    city: 'Mumbai',
    address: 'Juhu Beach, Mumbai',
    description: 'Coastal resort facing the Arabian Sea, with private balconies, rooftop dining and wellness experiences.',
    amenities: ['Beach access', 'Spa', 'Restaurant', 'Valet parking'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.7,
    featured: true,
    startingPrice: 255,
    maxGuests: 5,
  },
  {
    name: 'Azure Dawn Hotel',
    city: 'Goa',
    address: 'Calangute Beach, Goa',
    description: 'Beachfront luxury stays with cabanas, dining terraces and sunset poolside cocktails.',
    amenities: ['Private beach', 'Pool', 'Spa', 'Beach bar'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.6,
    featured: false,
    startingPrice: 195,
    maxGuests: 4,
  },
  {
    name: 'Crescent Garden Hotel',
    city: 'Jaipur',
    address: 'Amer Road, Jaipur',
    description: 'Heritage-inspired luxury retreat with a landscaped courtyard, spa rituals and rooftop dining.',
    amenities: ['Spa', 'Pool', 'Concierge', 'Restaurant'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.7,
    featured: false,
    startingPrice: 180,
    maxGuests: 4,
  },
  {
    name: 'Skyline Suites Delhi',
    city: 'New Delhi',
    address: 'Connaught Place, New Delhi',
    description: 'Urban luxury hotel with dynamic dining, cityscape views and premium business services.',
    amenities: ['Gym', 'Business center', 'Rooftop lounge', 'WiFi'],
    images: [
      'https://images.unsplash.com/photo-1483951947044-3e7d9033f4b5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.5,
    featured: false,
    startingPrice: 220,
    maxGuests: 4,
  },
  {
    name: 'Palazzo Luxe Chennai',
    city: 'Chennai',
    address: 'Marina Beach, Chennai',
    description: 'Contemporary luxury landmark near the sea, with gourmet dining and signature wellness spa.',
    amenities: ['Spa', 'Pool', 'Fine dining', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485256402244-1c114a50d0cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.4,
    featured: false,
    startingPrice: 175,
    maxGuests: 3,
  },
  {
    name: 'Lotus Park Retreat',
    city: 'Kochi',
    address: 'Fort Kochi, Kochi',
    description: 'Boutique riverside hotel with refined interiors, heritage charm and gourmet cuisine.',
    amenities: ['River view', 'Spa', 'Yoga studio', 'Restaurant'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.6,
    featured: false,
    startingPrice: 165,
    maxGuests: 4,
  },
  {
    name: 'Royal Horizon Pune',
    city: 'Pune',
    address: 'Koregaon Park, Pune',
    description: 'Contemporary luxury with leafy terraces, fine dining and city access for business travelers.',
    amenities: ['Gym', 'Spa', 'Restaurant', 'Valet'],
    images: [
      'https://images.unsplash.com/photo-1483951947044-3e7d9033f4b5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.5,
    featured: false,
    startingPrice: 200,
    maxGuests: 4,
  },
  {
    name: 'Harbor View Suites',
    city: 'Hyderabad',
    address: 'Hitech City, Hyderabad',
    description: 'Modern luxury hotel with skyline views, executive suites, and premium dining spaces.',
    amenities: ['Pool', 'Gym', 'WiFi', 'Business center'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.6,
    featured: false,
    startingPrice: 185,
    maxGuests: 4,
  },
  {
    name: 'Pearl Garden Retreat',
    city: 'Ahmedabad',
    address: 'CG Road, Ahmedabad',
    description: 'Luxury urban hotel with elegant rooms, curated dining, and attentive concierge service.',
    amenities: ['Spa', 'Gym', 'Restaurant', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.4,
    featured: false,
    startingPrice: 160,
    maxGuests: 3,
  },
  {
    name: 'Monarch Palace Udaipur',
    city: 'Udaipur',
    address: 'Lake Pichola, Udaipur',
    description: 'Palatial hotel with lakefront suites, private terraces, and royal hospitality touches.',
    amenities: ['Lake view', 'Spa', 'Fine dining', 'Butler service'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.9,
    featured: true,
    startingPrice: 320,
    maxGuests: 5,
  },
  {
    name: 'Opal Bay Retreat',
    city: 'Pondicherry',
    address: 'Promenade Beach, Pondicherry',
    description: 'Bright coastal hotel with refined rooms, an outdoor pool and a fresh artisan restaurant.',
    amenities: ['Beach access', 'Pool', 'Restaurant', 'Yoga classes'],
    images: [
      'https://images.unsplash.com/photo-1485256402244-1c114a50d0cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.3,
    featured: false,
    startingPrice: 160,
    maxGuests: 4,
  },
  {
    name: 'Harbor Lights Resort',
    city: 'Visakhapatnam',
    address: 'RK Beach, Visakhapatnam',
    description: 'Coastal resort with contemporary rooms, wellness spa and oceanfront dining.',
    amenities: ['Beach access', 'Pool', 'Spa', 'Gym'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.5,
    featured: false,
    startingPrice: 170,
    maxGuests: 4,
  },
  {
    name: 'Harvest Grove Resort',
    city: 'Kashmir',
    address: 'Gulmarg Road, Kashmir',
    description: 'Mountain-side lodge with alpine views, fireplace suites and elegant local design.',
    amenities: ['Spa', 'Ski shuttle', 'Fine dining', 'Fireplace'],
    images: [
      'https://images.unsplash.com/photo-1501117716987-c8e8c24f0b29?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485256402244-1c114a50d0cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.8,
    featured: true,
    startingPrice: 270,
    maxGuests: 4,
  },
  {
    name: 'Gardenia Palace Ahmedabad',
    city: 'Ahmedabad',
    address: 'Nehru Nagar, Ahmedabad',
    description: 'Premium city hotel with elegant banquet halls, wellness spa and executive suites.',
    amenities: ['Spa', 'Banquet', 'Gym', 'Restaurant'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.4,
    featured: false,
    startingPrice: 165,
    maxGuests: 3,
  },
  {
    name: 'Cedar Heights Hotel',
    city: 'Dehradun',
    address: 'Rajpur Road, Dehradun',
    description: 'Hillside hotel with modern suites, mountain views and a relaxing spa retreat.',
    amenities: ['Spa', 'Gym', 'Restaurant', 'WiFi'],
    images: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.5,
    featured: false,
    startingPrice: 185,
    maxGuests: 4,
  },
  {
    name: 'Silk Route Suites',
    city: 'Kolkata',
    address: 'Park Street, Kolkata',
    description: 'Luxury hotel with contemporary art, dining experiences and easy city access.',
    amenities: ['Restaurant', 'Gym', 'Spa', 'Bar'],
    images: [
      'https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.3,
    featured: false,
    startingPrice: 155,
    maxGuests: 3,
  },
  {
    name: 'Marina Pearl Suites',
    city: 'Chennai',
    address: 'ECR Road, Chennai',
    description: 'Modern coastal hotel with suites, scenic dining and ocean breezes.',
    amenities: ['Pool', 'Restaurant', 'Spa', 'Beach access'],
    images: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501117716987-c8e8c24f0b29?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.5,
    featured: false,
    startingPrice: 190,
    maxGuests: 4,
  },
  {
    name: 'Heritage Sky Palace',
    city: 'Lucknow',
    address: 'Gomti Nagar, Lucknow',
    description: 'Refined city hotel with bespoke suites, elegant dining and cultural hospitality.',
    amenities: ['Restaurant', 'Spa', 'Gym', 'Valet'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.4,
    featured: false,
    startingPrice: 170,
    maxGuests: 4,
  },
  {
    name: 'The Orchid Retreat',
    city: 'Ooty',
    address: 'Glenmorgan Road, Ooty',
    description: 'Hill station hideaway with lush gardens, cottages and cozy living areas.',
    amenities: ['Spa', 'Garden', 'Breakfast', 'WiFi'],
    images: [
      'https://images.unsplash.com/photo-1485256402244-1c114a50d0cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501117716987-c8e8c24f0b29?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.7,
    featured: true,
    startingPrice: 230,
    maxGuests: 4,
  },
  {
    name: 'Emerald Vista Hotel',
    city: 'Gurugram',
    address: 'Cyber City, Gurugram',
    description: 'Business-friendly luxury hotel with spacious rooms, high-speed internet, and executive lounges.',
    amenities: ['Gym', 'Restaurant', 'WiFi', 'Airport transfer'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.5,
    featured: false,
    startingPrice: 210,
    maxGuests: 4,
  },
  {
    name: 'Saffron Palace Hotel',
    city: 'Lucknow',
    address: 'Hazratganj, Lucknow',
    description: 'Luxury city hotel with opulent rooms, lively dining and premium service for executive guests.',
    amenities: ['Spa', 'Gym', 'Restaurant', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.3,
    featured: false,
    startingPrice: 175,
    maxGuests: 4,
  },
  {
    name: 'Aurora Bay Hotel',
    city: 'Mumbai',
    address: 'Marine Drive, Mumbai',
    description: 'Sea-facing luxury rooms with refined amenities, private dining, and skyline views.',
    amenities: ['Sea view', 'Spa', 'Restaurant', 'Gym'],
    images: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501117716987-c8e8c24f0b29?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.8,
    featured: true,
    startingPrice: 280,
    maxGuests: 5,
  },
  {
    name: 'Luna Grand Suites',
    city: 'Hyderabad',
    address: 'Banjara Hills, Hyderabad',
    description: 'Luxury suites with private lounges, gourmet dining, and premium service in a vibrant neighbourhood.',
    amenities: ['Spa', 'Gym', 'Fine dining', 'Concierge'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.7,
    featured: true,
    startingPrice: 250,
    maxGuests: 5,
  },
]

// Production-safe auto seeding function (called on server startup)
export const autoSeed = async () => {
  try {
    // Check if hotels already exist
    const hotelCount = await Hotel.countDocuments()
    if (hotelCount > 0) {
      console.log(`✓ Hotels already seeded (${hotelCount} hotels found)`)
      return
    }

    console.log('🌱 Starting automatic database seeding...')

    // Ensure admin account exists
    const adminExists = await User.findOne({ email: 'admin@example.com' })
    if (!adminExists) {
      const admin = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('Admin@123', 10),
        phone: '+10000000000',
        role: 'admin',
      })
      await admin.save()
      console.log('✓ Admin user created')
    } else {
      console.log('✓ Admin user already exists')
    }

    // Ensure demo users exist
    const guestExists = await User.findOne({ email: 'guest@example.com' })
    if (!guestExists) {
      const user = new User({
        name: 'Guest User',
        email: 'guest@example.com',
        password: await bcrypt.hash('Guest@123', 10),
        phone: '+10000000001',
      })
      await user.save()
      console.log('✓ Guest user created')
    } else {
      console.log('✓ Guest user already exists')
    }

    const demoExists = await User.findOne({ email: 'demo@example.com' })
    if (!demoExists) {
      const demoUser = new User({
        name: 'Demo User',
        email: 'demo@example.com',
        password: await bcrypt.hash('Demo@123', 10),
        phone: '+10000000002',
      })
      await demoUser.save()
      console.log('✓ Demo user created')
    } else {
      console.log('✓ Demo user already exists')
    }

    // Seed hotels and rooms
    let hotelSeeded = 0
    for (const hotelData of sampleHotels) {
      const hotelExists = await Hotel.findOne({ name: hotelData.name })
      if (!hotelExists) {
        const hotel = await Hotel.create(hotelData)
        await Room.create({
          hotelId: hotel._id,
          roomType: 'Deluxe Room',
          price: Math.round(hotelData.startingPrice * 1.1),
          capacity: Math.min(4, hotelData.maxGuests),
          availableRooms: 6,
          amenities: ['King bed', 'Breakfast included', 'WiFi', 'Air conditioning'],
          images: [hotelData.images[0], hotelData.images[1]],
          description: 'Comfortable room with premium amenities and elegant decor.',
        })
        await Room.create({
          hotelId: hotel._id,
          roomType: 'Executive Suite',
          price: Math.round(hotelData.startingPrice * 1.7),
          capacity: hotelData.maxGuests,
          availableRooms: 4,
          amenities: ['Suite lounge', 'Jacuzzi', 'Breakfast included', 'Complimentary minibar'],
          images: [hotelData.images[1], hotelData.images[2]],
          description: 'Spacious suite with premium services, a lounge area, and stunning views.',
        })
        hotelSeeded++
      }
    }
    console.log(`✓ Seeded ${hotelSeeded} hotels with rooms`)
    console.log('✅ Database seeding completed successfully')
  } catch (error) {
    console.error('❌ Error during auto-seeding:', error.message)
  }
}

// Manual reset and seed (for development/testing)
const run = async () => {
  await connectDB()
  console.log('🧹 Clearing all data...')
  await User.deleteMany()
  await Hotel.deleteMany()
  await Room.deleteMany()

  const admin = new User({
    name: 'Admin User',
    email: 'admin@example.com',
    password: await bcrypt.hash('Admin@123', 10),
    phone: '+10000000000',
    role: 'admin',
  })
  await admin.save()

  const user = new User({
    name: 'Guest User',
    email: 'guest@example.com',
    password: await bcrypt.hash('Guest@123', 10),
    phone: '+10000000001',
  })
  await user.save()

  for (const hotelData of sampleHotels) {
    const hotel = await Hotel.create(hotelData)
    await Room.create({
      hotelId: hotel._id,
      roomType: 'Deluxe Room',
      price: Math.round(hotelData.startingPrice * 1.1),
      capacity: Math.min(4, hotelData.maxGuests),
      availableRooms: 6,
      amenities: ['King bed', 'Breakfast included', 'WiFi', 'Air conditioning'],
      images: [hotelData.images[0], hotelData.images[1]],
      description: 'Comfortable room with premium amenities and elegant decor.',
    })
    await Room.create({
      hotelId: hotel._id,
      roomType: 'Executive Suite',
      price: Math.round(hotelData.startingPrice * 1.7),
      capacity: hotelData.maxGuests,
      availableRooms: 4,
      amenities: ['Suite lounge', 'Jacuzzi', 'Breakfast included', 'Complimentary minibar'],
      images: [hotelData.images[1], hotelData.images[2]],
      description: 'Spacious suite with premium services, a lounge area, and stunning views.',
    })
  }

  console.log('✅ Sample data seeded successfully')
  process.exit()
}

run().catch((err) => {
  console.error('❌ Seeding error:', err)
  process.exit(1)
})
