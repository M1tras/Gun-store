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
    imageUrl: "https://imgs.search.brave.com/utGVdwHH9cEOAF7qWGVNP69sr5cjemmv64f_hqUinAA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9ub24t/Zm9sZGluZy1odW50/aW5nLWtuaWZlLXdv/b2Rlbi1zdGFpbmVk/LW9hay1oYW5kbGUt/YmxhY2stbGVhdGhl/ci1zaGVhdGgtZ3Jh/eS1iYWNrZ3JvdW5k/LW5vbi1mb2xkaW5n/LWh1bnRpbmctMzky/MDA5MjUxLmpwZw",
  },
  {
    name: 'Camouflage Hunting Jacket',
    description: 'Waterproof and windproof jacket in woodland camo pattern. Breathable membrane, multiple pockets, adjustable hood.',
    price: 129.99,
    stock: 20,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/08ziSAySKtLqmWy8dGHfHjwlecX_tZvrUjDVoNAUldM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9oaWxs/bWFuZ2Vhci5jb20v/Y2RuL3Nob3AvcHJv/ZHVjdHMvRnVzaW9u/LUh1bnRpbmctQ2Ft/b3VmbGFnZS1KYWNr/ZXQtMl80NzY4YThm/YS1jOWFiLTQxZDYt/YmFhNi1kZDM3OTVh/ZTY2NjAuanBnP3Y9/MTc2MDAwMDAzOSZ3/aWR0aD04MDA",
  },
  {
    name: 'Binoculars 10x42',
    description: 'Roof prism binoculars with 10x magnification and 42mm objective lens. Fog-proof and waterproof. Ideal for scouting game.',
    price: 189.99,
    stock: 15,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/BxzESiKc1j_0XlUMOHE249LWf0ZOqt4wYwUxJHICgXs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9maXJl/ZmllbGQuY29tL2Nk/bi9zaG9wL3Byb2R1/Y3RzL0ZGMTIwMjBf/SU1HX2FsdF8xMDAw/XzUzNXguanBnP3Y9/MTc1MTU1NjkxOA",
  },
  {
    name: 'Hunting Backpack 45L',
    description: 'Durable 45-litre backpack with hydration sleeve, rifle/bow carrier straps, and scent-control lining.',
    price: 99.99,
    stock: 25,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/XA4PXj7VwRvvq8pYf9nSVvNiG3jxp-dLOEMo7HIpt3s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTF3Y0Z0Nm9IT0wu/anBn",
  },
  {
    name: 'Game Calls Set',
    description: 'Set of 5 calls for deer, elk, moose, duck and fox. Produces realistic sounds to attract game at distance.',
    price: 34.99,
    stock: 40,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/PdxKFBQbcTezs5K0hsraLvNoUUdsMmaQM8r_sPvcYA8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzgxZzFpb05laWxM/LmpwZw",
  },
  {
    name: 'Rifle Scope 4-16x50',
    description: 'Variable zoom 4-16x50mm scope with illuminated reticle and side parallax adjustment. Includes mounting rings.',
    price: 349.99,
    stock: 8,
    isRestricted: true,
    imageUrl: "https://imgs.search.brave.com/fl9cST4zlG_ls4keez4cIa6KiQrNgieEUI6TP0m3ktA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/MS5iaWdjb21tZXJj/ZS5jb20vcy1yN25i/ZXA3Mzc0L2ltYWdl/cy9zdGVuY2lsLzg1/MHg4NTAvcHJvZHVj/dHMvODUwLzE1OTU0/L0czLTQtMTZ4NTAt/RkZQLVJpZmxlLVNj/b3BlLUczRjQxNjUw/LVBhcmVudF85OTg0/X18zMDE4My4xNzYw/MTIwMTgxLmpwZz9j/PTI",
  },
  {
    name: 'Compound Bow 60lb',
    description: 'Adjustable draw weight 40-60 lbs compound bow with let-off up to 80%. Includes sight, arrow rest and stabiliser.',
    price: 499.99,
    stock: 6,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/Q2T-D1SIchTEGNRjDeZW7H2Qd8GSPDylsvNM44AjCDw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/MzFNb0EraUtGVUwu/anBn",
  },
  {
    name: 'Shotgun Cleaning Kit',
    description: 'Universal 12-gauge cleaning kit with brass rods, patches, bore brush and lubricant oil. Fits all standard shotguns.',
    price: 24.99,
    stock: 50,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/O8oAgVN_hVnUAH3NdpvLNyjF4w8ly1gz86s9McYafHc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/MS5iaWdjb21tZXJj/ZS5jb20vcy0ydDZh/bmFxZ3dpL2ltYWdl/cy9zdGVuY2lsLzg1/MHg4NTAvcHJvZHVj/dHMvMzU3Lzk0NzUv/bWVkaWFfXzMwMTky/LjE3NzAzNzY3MTYu/anBnP2M9MQ",
  },
  {
    name: 'Semi-Automatic Rifle .308',
    description: 'Licensed semi-automatic rifle chambered in .308 Win. 20-inch barrel, detachable 10-round magazine.',
    price: 1299.99,
    stock: 4,
    isRestricted: true,
    imageUrl: "https://imgs.search.brave.com/3TSA2QFFKrfwL3tHDsLhPvN_LCxdDFqxsehUT0Dd6n8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ndngu/YmxvYi5jb3JlLndp/bmRvd3MubmV0L2l0/ZW0taW1hZ2VzL3Zh/bHVlLXItMjU3NjUx/OS53ZWJw",
  },
  {
    name: 'Hunting Ammunition .308 (20 rounds)',
    description: 'Factory-loaded soft-point .308 Winchester hunting ammunition. 150 grain. Box of 20 rounds.',
    price: 32.99,
    stock: 100,
    isRestricted: true,
    imageUrl: "https://imgs.search.brave.com/-niWwMXJvFEjZqejWTC05ez7RrLW5O981J1JLele-jE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zaG9w/LmhzbWFtbXVuaXRp/b24uY29tL2Nkbi9z/aG9wL2ZpbGVzL0hT/TTMwODIxMFZMRC5q/cGc_dj0xNzMzNDE4/MzMyJndpZHRoPTE0/NDU",
  },
  {
    name: 'Trail Camera 24MP',
    description: 'Infrared trail camera with 24MP sensor, 0.3s trigger speed, and 30m night vision range. Weatherproof housing.',
    price: 89.99,
    stock: 18,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/1NP12-TapJjA6nmvTIm-SPuW5y2iiA72Eu-_gY4645k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dG9ndWFyZHNob3Au/Y29tL2Nkbi9zaG9w/L3Byb2R1Y3RzLzFf/ZDg1YThlYzctMmQ4/MS00ZDA2LWEwMWEt/MmJhMjM1MTYxNzIw/XzYwMHguanBnP3Y9/MTYyMjQ1NDExNA",
  },
  {
    name: 'Hunting Boots',
    description: 'Insulated waterproof leather hunting boots with Vibram sole. Rated to -20°C.',
    price: 159.99,
    stock: 12,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/hTqVMJMWeWkpkwQ2Ane1VsByllRos1A1D0zg7f172gY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9kaWdpdGFsLWlt/YWdlLWh1bnRpbmct/Ym9vdHMtaXNvbGF0/ZWQtd2hpdGUtYmFj/a2dyb3VuZC1oaWdo/LXF1YWxpdHktaGln/aC1yZXNvbHV0aW9u/XzExMDI5NDQtNzc3/Mi5qcGc_c2VtdD1h/aXNfaHlicmlk",
  },
  {
    name: 'Tactical Flashlight 1000lm',
    description: 'Compact 1000-lumen tactical flashlight with five modes including strobe. Aircraft-grade aluminium, IPX8 waterproof.',
    price: 44.99,
    stock: 35,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/Nz9uyRrFdmx7VKVAbnVsPrjN3U7w3xKsv1VzSdLYqaQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFENm1NWW9yMUwu/anBn",
  },
  {
    name: 'Hunting Rangefinder 1000m',
    description: 'Laser rangefinder accurate to ±1m up to 1000m. Angle compensation mode for uphill/downhill shots. Compact monocular design.',
    price: 219.99,
    stock: 10,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/3RcAVPoJ_5mRnBf-EDSQ1WIEqBBZuV0i_AUZsWBP_1s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFZWTI4eXhhd0wu/anBn",
  },
  {
    name: 'Ghillie Suit',
    description: '3D leafy ghillie suit in woodland pattern. Lightweight breathable mesh base with attached foliage. One size fits most.',
    price: 74.99,
    stock: 14,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/xSPIxQyqzCHpJn7J0V_CXCNFYfh0FiHm7FQ4-yGS5Ek/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFQd2RiaEpPVUwu/anBn",
  },
  {
    name: 'Handgun 9mm',
    description: 'Licensed semi-automatic 9mm handgun. 4-inch barrel, 15-round magazine, ambidextrous controls. Includes hard case and two magazines.',
    price: 749.99,
    stock: 5,
    isRestricted: true,
    imageUrl: "https://imgs.search.brave.com/fJCb3xRaOAL8c49Tf3t6_IwRv4R9bKmEKAQKoaMG8Y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9lL2U0L0ds/b2NrXzE3X3Vuc2Fv/ZWQuanBnLzEyMDBw/eC1HbG9ja18xN191/bnNhb2VkLmpwZw",
  },
  {
    name: 'Hunting Crossbow 175lb',
    description: '175 lb draw weight crossbow with 4x32 scope, quiver and 3 bolts. Shoots 350 fps. Compact reverse-draw design.',
    price: 389.99,
    stock: 7,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/6jGRK4rJmvEDkRMzAmO3U-K0EklSo8aFSdT3jzW5MO0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFRMXBYaVR0eUwu/anBn",
  },
  {
    name: 'Rifle Bipod',
    description: 'Adjustable 6–9 inch aluminium bipod with swivel stud attachment. Spring-loaded legs, 360° pan and 45° cant.',
    price: 59.99,
    stock: 22,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/LQsYSY0MxfIg5nYOBhFenCvn4J47_V5FzNKIHrMhx0M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFNZlI3WXo3OUwu/anBn",
  },
  {
    name: 'Night Vision Monocular',
    description: 'Gen-1 night vision monocular with 3x magnification and built-in IR illuminator. Range up to 100m in complete darkness.',
    price: 299.99,
    stock: 6,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/OvHEXRrTw_5YhOIYhkAEMJV-BqvtxFg3cqVh2t-HFg4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFXVFd1b0p0VUwu/anBn",
  },
  {
    name: 'Hunting Rifle .30-06',
    description: 'Bolt-action hunting rifle in .30-06 Springfield. 22-inch free-floating barrel, walnut stock, 4-round internal magazine.',
    price: 1099.99,
    stock: 3,
    isRestricted: true,
    imageUrl: "https://imgs.search.brave.com/7xAIrgfkLbqbA1zTFZHJMYfmFz8Rd39g6sEHJn7bJgk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi8xLzFhL1Np/bW9ub3ZfTW9zaW5f/TmFnYW50LmpwZy8x/MjAwcHgtU2ltb25v/dl9Nb3Npbl9OYWdh/bnQuanBn",
  },
  {
    name: 'Ammunition .30-06 (20 rounds)',
    description: 'Premium soft-point .30-06 Springfield hunting rounds. 180 grain. Controlled expansion for ethical one-shot kills. Box of 20.',
    price: 38.99,
    stock: 80,
    isRestricted: true,
    imageUrl: "https://imgs.search.brave.com/-niWwMXJvFEjZqejWTC05ez7RrLW5O981J1JLele-jE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zaG9w/LmhzbWFtbXVuaXRp/b24uY29tL2Nkbi9z/aG9wL2ZpbGVzL0hT/TTMwODIxMFZMRC5q/cGc_dj0xNzMzNDE4/MzMyJndpZHRoPTE0/NDU",
  },
  {
    name: 'Portable Hunting Blind',
    description: 'Pop-up ground blind in 3D camo. Sets up in under 2 minutes. 270° shooting lanes, scent-blocker fabric, carry bag included.',
    price: 119.99,
    stock: 9,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/XJlgkp2FE8XuRzOGFoexwkQJtFvE0W8cxMKmK8Y11uc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFzOFc2TzVqMkwu/anBn",
  },
  {
    name: 'Hunting Gloves',
    description: 'Lightweight camo hunting gloves with touch-screen compatible fingertips and non-slip palm grip. Sizes S–XL.',
    price: 22.99,
    stock: 45,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/6K4MbD_rNqRm3HiJakSswcG9CdqAyVFHcpGNF8R1JBw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFvSHVPYWthaUwu/anBn",
  },
  {
    name: 'Field Dressing Kit',
    description: 'Complete 8-piece field dressing kit: gut hook, skinning knife, bone saw, gloves and zip-lock bags in a roll-up pouch.',
    price: 37.99,
    stock: 28,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/mFEkf0VuoqgH1t_yTBEkm3VKmf0NbO7XFoMk6YaBDKQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFQYzFNbU1wdUwu/anBn",
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
