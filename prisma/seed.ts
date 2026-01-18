const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

// Random data generators
const firstNames = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Lisa', 'Daniel', 'Nancy',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
];

const storeTypes = [
  'Electronics', 'Grocery', 'Fashion', 'Home & Living', 'Sports', 'Books',
  'Toys', 'Beauty', 'Health', 'Automotive', 'Pet Supplies', 'Garden',
  'Office', 'Music', 'Art', 'Furniture', 'Jewelry', 'Food', 'Bakery', 'Cafe'
];

const storeAdjectives = [
  'Premium', 'Super', 'Mega', 'Express', 'Quick', 'Smart', 'Golden', 'Royal',
  'Prime', 'Elite', 'Star', 'Best', 'Top', 'Great', 'Amazing', 'Fantastic'
];

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'Fort Worth', 'Columbus', 'Indianapolis', 'Charlotte', 'Seattle', 'Denver',
  'Boston', 'Portland', 'Miami', 'Atlanta', 'Orlando', 'Las Vegas'
];

const streets = [
  'Main Street', 'Oak Avenue', 'Maple Drive', 'Cedar Lane', 'Pine Road',
  'Elm Boulevard', 'Park Way', 'Lake Street', 'Hill Road', 'River Drive',
  'Valley Avenue', 'Mountain View', 'Sunset Boulevard', 'Ocean Drive', 'Beach Road'
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomName(): string {
  return `${getRandomElement(firstNames)} ${getRandomElement(lastNames)} User`;
}

function generateRandomStoreName(): string {
  return `${getRandomElement(storeAdjectives)} ${getRandomElement(storeTypes)} Store`;
}

function generateRandomAddress(): string {
  const num = getRandomNumber(100, 9999);
  return `${num} ${getRandomElement(streets)}, ${getRandomElement(cities)}, ${getRandomNumber(10000, 99999)}`;
}

function generateRandomEmail(prefix: string, index: number): string {
  return `${prefix}${index}@example.com`;
}

async function main() {
  console.log('🌱 Seeding database with random data...');

  // Clean up existing data (in reverse order of dependencies)
  console.log('🧹 Cleaning up existing data...');
  await prisma.rating.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Cleaned up existing data');

  // Hash password helper
  const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  };

  const defaultPassword = await hashPassword('Password@123');

  // Create System Administrator
  const adminPassword = await hashPassword('Admin@123');
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator User',
      email: 'admin@storerating.com',
      password: adminPassword,
      address: '123 Admin Street, Tech City, TC 12345',
      role: UserRole.SYSTEM_ADMIN,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create Store Owners and Stores (15 stores)
  const storeOwners: any[] = [];
  const stores: any[] = [];
  
  for (let i = 1; i <= 15; i++) {
    const ownerName = generateRandomName();
    const ownerEmail = generateRandomEmail('storeowner', i);
    const ownerAddress = generateRandomAddress();
    
    const storeOwner = await prisma.user.create({
      data: {
        name: ownerName,
        email: ownerEmail,
        password: defaultPassword,
        address: ownerAddress,
        role: UserRole.STORE_OWNER,
      },
    });
    storeOwners.push(storeOwner);
    console.log(`✅ Created store owner ${i}:`, storeOwner.email);

    const storeName = generateRandomStoreName();
    const storeEmail = `store${i}@${getRandomElement(storeTypes).toLowerCase().replace(/\s+/g, '')}.com`;
    const storeAddress = generateRandomAddress();

    const store = await prisma.store.create({
      data: {
        name: storeName,
        email: storeEmail,
        address: storeAddress,
        ownerId: storeOwner.id,
      },
    });
    stores.push(store);
    console.log(`✅ Created store ${i}:`, store.name);
  }

  // Create Normal Users (30 users)
  const normalUsers: any[] = [];
  
  for (let i = 1; i <= 30; i++) {
    const userName = generateRandomName();
    const userEmail = generateRandomEmail('user', i);
    const userAddress = generateRandomAddress();
    
    const normalUser = await prisma.user.create({
      data: {
        name: userName,
        email: userEmail,
        password: defaultPassword,
        address: userAddress,
        role: UserRole.NORMAL_USER,
      },
    });
    normalUsers.push(normalUser);
    console.log(`✅ Created normal user ${i}:`, normalUser.email);
  }

  // Create Random Ratings (each user rates random stores)
  console.log('\n📊 Creating random ratings...');
  let ratingCount = 0;
  
  for (const user of normalUsers) {
    // Each user rates 3-8 random stores
    const numRatings = getRandomNumber(3, 8);
    const shuffledStores = [...stores].sort(() => Math.random() - 0.5);
    const storesToRate = shuffledStores.slice(0, numRatings);
    
    for (const store of storesToRate) {
      const ratingValue = getRandomNumber(1, 5);
      
      await prisma.rating.create({
        data: {
          value: ratingValue,
          userId: user.id,
          storeId: store.id,
        },
      });
      ratingCount++;
    }
  }
  console.log(`✅ Created ${ratingCount} ratings`);

  // Summary
  const totalUsers = await prisma.user.count();
  const totalStores = await prisma.store.count();
  const totalRatings = await prisma.rating.count();

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📈 Database Statistics:');
  console.log(`   Total Users: ${totalUsers}`);
  console.log(`   Total Stores: ${totalStores}`);
  console.log(`   Total Ratings: ${totalRatings}`);
  console.log('\n📝 Sample Credentials (Password: Password@123 for all):');
  console.log('Admin: admin@storerating.com / Admin@123');
  console.log('Store Owner: storeowner1@example.com / Password@123');
  console.log('Normal User: user1@example.com / Password@123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
