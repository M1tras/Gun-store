require('dotenv').config();
const { sequelize } = require('./models');
const { Product, User } = require('./models');
const bcrypt = require('bcryptjs');

const products = [
  {
    name: 'Hunting Knife',
    description: 'Full-tang fixed blade knife with a 12cm drop-point blade. Comes with a leather sheath. Ideal for field dressing and camp tasks.',
    price: 49.99,
    stock: 30,
    isRestricted: false,
    imageUrl: null,
  },
  {
    name: 'Camouflage Hunting Jacket',
    description: 'Waterproof and windproof jacket in woodland camo pattern. Breathable membrane, multiple pockets, adjustable hood.',
    price: 129.99,
    stock: 20,
    isRestricted: false,
    imageUrl: null,
  },
  {
    name: 'Binoculars 10x42',
    description: 'Roof prism binoculars with 10x magnification and 42mm objective lens. Fog-proof and waterproof. Ideal for scouting game.',
    price: 189.99,
    stock: 15,
    isRestricted: false,
    imageUrl: null,
  },
  {
    name: 'Hunting Backpack 45L',
    description: 'Durable 45-litre backpack with hydration sleeve, rifle/bow carrier straps, and scent-control lining.',
    price: 99.99,
    stock: 25,
    isRestricted: false,
    imageUrl: null,
  },
  {
    name: 'Game Calls Set',
    description: 'Set of 5 calls for deer, elk, moose, duck and fox. Produces realistic sounds to attract game at distance.',
    price: 34.99,
    stock: 40,
    isRestricted: false,
    imageUrl: null,
  },
  {
    name: 'Rifle Scope 4-16x50',
    description: 'Variable zoom 4-16x50mm scope with illuminated reticle and side parallax adjustment. Includes mounting rings.',
    price: 349.99,
    stock: 8,
    isRestricted: true,
    imageUrl: null,
  },
  {
    name: 'Compound Bow 60lb',
    description: 'Adjustable draw weight 40-60 lbs compound bow with let-off up to 80%. Includes sight, arrow rest and stabiliser.',
    price: 499.99,
    stock: 6,
    isRestricted: false,
    imageUrl: null,
  },
  {
    name: 'Shotgun Cleaning Kit',
    description: 'Universal 12-gauge cleaning kit with brass rods, patches, bore brush and lubricant oil. Fits all standard shotguns.',
    price: 24.99,
    stock: 50,
    isRestricted: false,
    imageUrl: null,
  },
  {
    name: 'Semi-Automatic Rifle .308',
    description: 'Licensed semi-automatic rifle chambered in .308 Win. 20-inch barrel, detachable 10-round magazine.',
    price: 1299.99,
    stock: 4,
    isRestricted: true,
    imageUrl: null,
  },
  {
    name: 'Hunting Ammunition .308 (20 rounds)',
    description: 'Factory-loaded soft-point .308 Winchester hunting ammunition. 150 grain. Box of 20 rounds.',
    price: 32.99,
    stock: 100,
    isRestricted: true,
    imageUrl: null,
  },
  {
    name: 'Trail Camera 24MP',
    description: 'Infrared trail camera with 24MP sensor, 0.3s trigger speed, and 30m night vision range. Weatherproof housing.',
    price: 89.99,
    stock: 18,
    isRestricted: false,
    imageUrl: null,
  },
  {
    name: 'Hunting Boots',
    description: 'Insulated waterproof leather hunting boots with Vibram sole. Rated to -20°C.',
    price: 159.99,
    stock: 12,
    isRestricted: false,
    imageUrl: null,
  },
];

const users = [
  {
    name: 'Admin',
    email: 'admin@jager.ee',
    password: 'admin123',
    age: 30,
    hasGunLicense: true,
    role: 'admin',
  },
  {
    name: 'Test User',
    email: 'user@jager.ee',
    password: 'user123',
    age: 25,
    hasGunLicense: false,
    role: 'user',
  },
  {
    name: 'Licensed User',
    email: 'licensed@jager.ee',
    password: 'user123',
    age: 35,
    hasGunLicense: true,
    role: 'user',
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    await sequelize.sync({ alter: true });
    console.log('Tables synced.');

    // Seed products
    await Product.destroy({ where: {} });
    await Product.bulkCreate(products);
    console.log(`Inserted ${products.length} products.`);

    // Seed users (skip if email already exists)
    for (const u of users) {
      const exists = await User.findOne({ where: { email: u.email } });
      if (exists) {
        console.log(`User ${u.email} already exists, skipping.`);
        continue;
      }
      const hashed = await bcrypt.hash(u.password, 12);
      await User.create({ ...u, password: hashed });
      console.log(`Created user: ${u.email} (password: ${u.password})`);
    }

    console.log('\nSeed complete.');
    console.log('  Admin:          admin@jager.ee / admin123');
    console.log('  Regular user:   user@jager.ee / user123');
    console.log('  Licensed user:  licensed@jager.ee / user123');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();
