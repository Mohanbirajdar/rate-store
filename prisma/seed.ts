const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password helper
  const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  };

  // Create System Administrator
  const adminPassword = await hashPassword('Admin@123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@storerating.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@storerating.com',
      password: adminPassword,
      address: '123 Admin Street, Tech City, TC 12345',
      role: UserRole.SYSTEM_ADMIN,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create Sample Store Owners
  const storeOwner1Password = await hashPassword('Store@123');
  const storeOwner1 = await prisma.user.upsert({
    where: { email: 'owner1@grocery.com' },
    update: {},
    create: {
      name: 'John Store Owner One',
      email: 'owner1@grocery.com',
      password: storeOwner1Password,
      address: '456 Market Avenue, Downtown, DT 67890',
      role: UserRole.STORE_OWNER,
    },
  });
  console.log('✅ Created store owner 1:', storeOwner1.email);

  const storeOwner2Password = await hashPassword('Store@456');
  const storeOwner2 = await prisma.user.upsert({
    where: { email: 'owner2@electronics.com' },
    update: {},
    create: {
      name: 'Jane Store Owner Two',
      email: 'owner2@electronics.com',
      password: storeOwner2Password,
      address: '789 Tech Boulevard, Innovation Park, IP 11223',
      role: UserRole.STORE_OWNER,
    },
  });
  console.log('✅ Created store owner 2:', storeOwner2.email);

  // Create Stores
  const store1 = await prisma.store.upsert({
    where: { email: 'owner1@grocery.com' },
    update: {},
    create: {
      name: 'Fresh Grocery Mart Store',
      email: 'owner1@grocery.com',
      address: '456 Market Avenue, Downtown, DT 67890',
      ownerId: storeOwner1.id,
    },
  });
  console.log('✅ Created store 1:', store1.name);

  const store2 = await prisma.store.upsert({
    where: { email: 'owner2@electronics.com' },
    update: {},
    create: {
      name: 'TechWorld Electronics Store',
      email: 'owner2@electronics.com',
      address: '789 Tech Boulevard, Innovation Park, IP 11223',
      ownerId: storeOwner2.id,
    },
  });
  console.log('✅ Created store 2:', store2.name);

  // Create Sample Normal Users
  const normalUser1Password = await hashPassword('User@123');
  const normalUser1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      name: 'Alice Normal User One',
      email: 'user1@example.com',
      password: normalUser1Password,
      address: '321 Residential Lane, Suburb Area, SA 44556',
      role: UserRole.NORMAL_USER,
    },
  });
  console.log('✅ Created normal user 1:', normalUser1.email);

  const normalUser2Password = await hashPassword('User@456');
  const normalUser2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      name: 'Bob Normal User Two',
      email: 'user2@example.com',
      password: normalUser2Password,
      address: '654 Community Drive, Neighborhood, NB 77889',
      role: UserRole.NORMAL_USER,
    },
  });
  console.log('✅ Created normal user 2:', normalUser2.email);

  // Create Sample Ratings
  const rating1 = await prisma.rating.upsert({
    where: { userId_storeId: { userId: normalUser1.id, storeId: store1.id } },
    update: {},
    create: {
      value: 5,
      userId: normalUser1.id,
      storeId: store1.id,
    },
  });
  console.log('✅ Created rating 1');

  const rating2 = await prisma.rating.upsert({
    where: { userId_storeId: { userId: normalUser2.id, storeId: store1.id } },
    update: {},
    create: {
      value: 4,
      userId: normalUser2.id,
      storeId: store1.id,
    },
  });
  console.log('✅ Created rating 2');

  const rating3 = await prisma.rating.upsert({
    where: { userId_storeId: { userId: normalUser1.id, storeId: store2.id } },
    update: {},
    create: {
      value: 3,
      userId: normalUser1.id,
      storeId: store2.id,
    },
  });
  console.log('✅ Created rating 3');

  console.log('🎉 Seeding completed successfully!');
  console.log('\n📝 Sample Credentials:');
  console.log('Admin: admin@storerating.com / Admin@123');
  console.log('Store Owner 1: owner1@grocery.com / Store@123');
  console.log('Store Owner 2: owner2@electronics.com / Store@456');
  console.log('Normal User 1: user1@example.com / User@123');
  console.log('Normal User 2: user2@example.com / User@456');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
