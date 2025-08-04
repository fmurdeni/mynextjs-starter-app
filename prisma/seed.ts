import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create default admin user
  const adminEmail = 'admin@example.com'
  const adminPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Created admin user:', { email: admin.email, role: admin.role })

  // Create default regular user
  const userEmail = 'user@example.com'
  const userPassword = await bcrypt.hash('user123', 12)

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: 'Test User',
      password: userPassword,
      role: 'USER',
    },
  })

  console.log('✅ Created regular user:', { email: user.email, role: user.role })

  console.log('🎉 Database seeding completed!')
  console.log('\n📋 Default Login Credentials:')
  console.log('👑 Admin User:')
  console.log('   Email: admin@example.com')
  console.log('   Password: admin123')
  console.log('\n👤 Regular User:')
  console.log('   Email: user@example.com')
  console.log('   Password: user123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
