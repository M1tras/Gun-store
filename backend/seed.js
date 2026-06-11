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
    imageUrl: "https://imgs.search.brave.com/Jp4yz8FHJh1zOo-wnG-j_wzPO4E7xOdKy1bZRHVhvr0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dWx0cmFmaXJlLmNv/bS9jZG4vc2hvcC9m/aWxlcy9VbHRyYUZp/cmVUMVVsdHJhVGFj/dGljYWxMRURGbGFz/aGxpZ2h0LTEwMDBM/TV8xLmpwZz92PTE3/NTE3MDA5NzU",
  },
  {
    name: 'Hunting Rangefinder 1000m',
    description: 'Laser rangefinder accurate to ±1m up to 1000m. Angle compensation mode for uphill/downhill shots. Compact monocular design.',
    price: 219.99,
    stock: 10,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/PpZJCuSTOkZPBw9Ij1kO617B0AE7UwZxczuLgmPSsjY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/a2VudGZhaXRoLmNv/bS9jYWNoZS9jYXRh/bG9nL3Byb2R1Y3Rz/L3VzL0dXNTYuMDA0/Ni9HVzU2LjAwNDYt/MS01MTh4NTE4Lmpw/Zw",
  },
  {
    name: 'Ghillie Suit',
    description: '3D leafy ghillie suit in woodland pattern. Lightweight breathable mesh base with attached foliage. One size fits most.',
    price: 74.99,
    stock: 14,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/1g9iOnIL0h2QYhMN248eEzTFL5KNw3MKBbLFT4tfRII/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ub3J0/aG1vdW50YWluZ2Vh/ci5jb20vY2RuL3No/b3AvcHJvZHVjdHMv/aHlicmlkLWdoaWxs/aWUtc3VpdC13b29k/bGFuZC1icm93bi1u/b3J0aC1tb3VudGFp/bi1nZWFyLTIuanBn/P3Y9MTY4Mjg3NjA0/MiZ3aWR0aD0xMDI0",
  },
  {
    name: 'Handgun 9mm',
    description: 'Licensed semi-automatic 9mm handgun. 4-inch barrel, 15-round magazine, ambidextrous controls. Includes hard case and two magazines.',
    price: 749.99,
    stock: 5,
    isRestricted: true,
    imageUrl: "https://imgs.search.brave.com/2Q-nelWl5yru48DlRLPUJJQ8XKZj8f65fw0lUOHO2PE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi85bW0t/aGFuZGd1bi1hbW1v/LTI4NDI5NDA1Lmpw/Zw",
  },
  {
    name: 'Hunting Crossbow 175lb',
    description: '175 lb draw weight crossbow with 4x32 scope, quiver and 3 bolts. Shoots 350 fps. Compact reverse-draw design.',
    price: 389.99,
    stock: 7,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/dwhxQCbtOLp0hrFIFjElsrdl3cFSUpHN9yTiGNQzCDo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFkb3lVVkNZckwu/anBn",
  },
  {
    name: 'Rifle Bipod',
    description: 'Adjustable 6–9 inch aluminium bipod with swivel stud attachment. Spring-loaded legs, 360° pan and 45° cant.',
    price: 59.99,
    stock: 22,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/rLfnYuyd-oS9hQLgENEOuc3VFvEt5TXaNyolgXYB2iE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93aWxk/ZXJuZXNzdG9kYXku/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIwLzAzL0NWTElG/RS1UYWN0aWNhbC1S/aWZsZS1CaXBvZC5q/cGc",
  },
  {
    name: 'Night Vision Monocular',
    description: 'Gen-1 night vision monocular with 3x magnification and built-in IR illuminator. Range up to 100m in complete darkness.',
    price: 299.99,
    stock: 6,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/FDo5OlA260t7FyusvHIG4EHHZaUp5xlbFPchdZANmh8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nLzRmY0FB/ZVN3bG8xcFFoejQv/cy1sNDAwLndlYnA",
  },
  {
    name: 'Hunting Rifle .30-06',
    description: 'Bolt-action hunting rifle in .30-06 Springfield. 22-inch free-floating barrel, walnut stock, 4-round internal magazine.',
    price: 1099.99,
    stock: 3,
    isRestricted: true,
    imageUrl: "https://imgs.search.brave.com/b_J04onLGr3nT1K_DvvqF1hLamyyW9q_nLwE86tsYHg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c3BvcnRzbWFucy5j/b20vbWVkaWFzL3Nh/dmFnZS1hcm1zLWF4/aXMtMi14cC1oYXJk/d29vZC0zMC0wNi1z/cHJpbmdmaWVsZC1t/YXR0ZS1ibGFja2hh/cmR3b29kLWJvbHQt/YWN0aW9uLXJpZmxl/LTIyaW4tMTg5Nzc3/NS0xLmpwZz9jb250/ZXh0PWJXRnpkR1Z5/ZkdsdFlXZGxjM3cx/T0RFeWZHbHRZV2Rs/TDJwd1pXZDhZVVJr/YTB3eWFHbE5Remg0/VFdwbmVrNTZSVEZP/UkdNMFRYcEpNazFw/T0hwTlJFRjBXVEk1/ZFdSdFZubGpNbXgy/WW10YWRtTnRNV2hr/UmpscFdWaE9iRXhY/VG5aaWJscHNZMjVP/Y0dJeU5VZGlNMHAw/V1ZoU1ptTXlNVE5N/VkVVMFQxUmpNMDU2/VlhSTlV6VnhZMGRq/ZkRReFptUTFPV1Js/WkRVellqWXpOMlEz/TW1ZME56RTVZV0Uz/TTJRNU4yWm1ZalJq/WVRKa1pXTTNZakZq/WXpnNU1qVTNNbVkz/T0dSa01HTTFOMlpt/WVRV",
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
    imageUrl: "https://imgs.search.brave.com/ugzNR2OTxhfQbIkIoldRWIuOzEmVhZ5YziJtkDCKBzA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pNS53/YWxtYXJ0aW1hZ2Vz/LmNvbS9zZW8vVkVW/T1ItSHVudGluZy1C/bGluZC0yNzAtU2Vl/LUdyb3VuZC1CbGlu/ZC0yLTMtUGVyc29u/LVBvcC1EZWVyLUJs/aW5kLUh1bnRpbmct/Q2FycnlpbmctQmFn/LVBvcnRhYmxlLVJl/c2lsaWVudC1IdW50/aW5nLVRlbnQtT25l/LVdheS1TZWUtVGhy/b3VnaC1NZXNoLVR1/cmtfZDNlMDkyN2It/N2YyZC00MTZhLWI5/Y2ItZGIzNDUyYTM4/NWVkLjQ3MWFjYzVj/NjU3OGJlMmJmYmMz/YTM2MGZiNjZmNTU5/LmpwZWc_b2RuSGVp/Z2h0PTMyMCZvZG5X/aWR0aD0zMjAmb2Ru/Qmc9RkZGRkZG",
  },
  {
    name: 'Hunting Gloves',
    description: 'Lightweight camo hunting gloves with touch-screen compatible fingertips and non-slip palm grip. Sizes S–XL.',
    price: 22.99,
    stock: 45,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/ufW7-1GQbTOCZJe1j8mg_XzrTNd4mpvoPzK2h9ryXsA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZS5zcG9ydHNtYW5z/Z3VpZGUuY29tL2Fk/aW1ncy9lLzcvNzE5/NzIyaV90cy5qcGc",
  },
  {
    name: 'Field Dressing Kit',
    description: 'Complete 8-piece field dressing kit: gut hook, skinning knife, bone saw, gloves and zip-lock bags in a roll-up pouch.',
    price: 37.99,
    stock: 28,
    isRestricted: false,
    imageUrl: "https://imgs.search.brave.com/0ZtITAsT94nckyNmyvTXfS4z9uhFppsXBqg08WffA6o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzgxQ0Z2RDVacDVM/LmpwZw",
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
