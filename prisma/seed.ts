import { prisma } from '../src/lib/db/prisma';
import { Role, UserStatus, CardStatus, TransactionType, DocumentType, ShopStatus } from '../generated/prisma';
import { faker } from '@faker-js/faker';

async function main() {
  // Create a SUPER_ADMIN first (needed for area createdById)
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@example.com',
      name: 'Super Admin',
      phone: '9810000000',
      userId: 'SUPERADMIN1',
      password: 'superadminpass',
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  // Create Areas (need createdById)
  const areas: any[] = [];
  for (let i = 0; i < 10; i++) {
    const area = await prisma.area.create({
      data: {
        name: `Area ${i + 1}`,
        code: `A${i + 1}`,
        createdById: superAdmin.id,
      },
    });
    areas.push(area);
  }

  // Create ADMIN
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      phone: '9810000001',
      userId: 'ADMIN1',
      password: 'adminpass',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      areas: { connect: [{ id: areas[1].id }] },
      createdById: superAdmin.id,
      approvedById: superAdmin.id,
    },
  });

  // Create SHOP_OWNERs and their unique Shops
  const users: any[] = [superAdmin, admin];
  const shopOwners: any[] = [];
  const shops: any[] = [];
  for (let i = 0; i < 10; i++) {
    const shopOwner = await prisma.user.create({
      data: {
        email: `shopowner${i + 1}@example.com`,
        name: `Shop Owner ${i + 1}`,
        phone: '98100000' + (10 + i),
        userId: `SHOPOWNER${i + 1}`,
        password: 'shopownerpass',
        role: Role.SHOP_OWNER,
        status: UserStatus.ACTIVE,
        areas: { connect: [{ id: areas[(i + 2) % 10].id }] },
        createdById: admin.id,
        approvedById: admin.id,
      },
    });
    users.push(shopOwner);
    shopOwners.push(shopOwner);

    // Create a unique shop for each SHOP_OWNER
    const shop = await prisma.shop.create({
      data: {
        name: `Shop ${i + 1}`,
        ownerId: shopOwner.id,
        areaId: areas[i % 10].id,
        createdById: admin.id,
        approvedById: superAdmin.id,
        status: ShopStatus.OPEN,
      },
    });
    shops.push(shop);
  }

  // Create USERs
  for (let i = 0; i < 38; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i + 1}@example.com`,
        name: `User ${i + 1}`,
        phone: '98100001' + (10 + i),
        userId: `USER${i + 1}`,
        password: 'userpass',
        role: Role.USER,
        status: UserStatus.ACTIVE,
        areas: { connect: [{ id: areas[(i + 5) % 10].id }] },
        createdById: admin.id,
        approvedById: admin.id,
      },
    });
    users.push(user);
  }

  // ...shops are now created above with each SHOP_OWNER

  // Create Cards (one per user)
  const cards: any[] = [];
  for (let i = 0; i < users.length; i++) {
    const card = await prisma.card.create({
      data: {
        cardNumber: faker.finance.creditCardNumber(),
        cardHolder: users[i].name,
        expiryDate: faker.date.future({ years: 5 }),
        cvv: faker.finance.creditCardCVV(),
        url: faker.image.url(),
        points: faker.number.float({ min: 0, max: 1000 }),
        userId: users[i].id,
        createdById: admin.id,
        approvedById: superAdmin.id,
        status: CardStatus.ACTIVE,
      },
    });
    cards.push(card);
  }

  // Create Transactions (2 per card)
  for (let i = 0; i < cards.length * 2; i++) {
    const cardIdx = i % cards.length;
    await prisma.transaction.create({
      data: {
        cardId: cards[cardIdx].id,
        amount: faker.number.float({ min: 10, max: 500 }),
        type: faker.helpers.arrayElement([
          TransactionType.ADD,
          TransactionType.REDEEM,
          TransactionType.ADJUST,
        ]),
        remarks: faker.lorem.sentence(),
        performedById: users[cardIdx].id,
      },
    });
  }

  // Create Documents (one per user)
  for (let i = 0; i < users.length; i++) {
    await prisma.document.create({
      data: {
        url: faker.image.avatar() + `?u=${users[i].id}`,
        type: faker.helpers.arrayElement([
          DocumentType.PHOTO,
          DocumentType.AADHAAR_FRONT,
          DocumentType.AADHAAR_BACK,
        ]),
        userId: users[i].id,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// ...existing code...