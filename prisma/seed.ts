import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password1234';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      name: 'Site Admin',
      passwordHash,
      role: 'admin'
    }
  });

  const existingProfile = await prisma.siteProfile.findFirst();
  if (!existingProfile) {
    await prisma.siteProfile.create({
      data: {
        title: process.env.NEXT_PUBLIC_SITE_TITLE || 'Portfolio',
        tagline: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A simple portfolio site.',
        ctaText: 'Contact Me',
        ctaHref: '#contact'
      }
    });
  }

  const existingMessages = await prisma.contactMessage.count();
  if (existingMessages === 0) {
    await prisma.contactMessage.createMany({
      data: [
        {
          name: 'Alex Johnson',
          email: 'alex@example.com',
          message: 'Loved your portfolio! Are you available for a freelance project?'
        },
        {
          name: 'Morgan Lee',
          email: 'morgan@example.com',
          message: 'Let6s connect about a potential collaboration next month.'
        },
        {
          name: 'Sam Rivera',
          email: 'sam@example.com',
          message: 'Great work. Could you share more about your process?'
        }
      ]
    });
  }
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
