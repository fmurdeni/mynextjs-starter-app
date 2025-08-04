const { Client } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  console.log('🔍 Checking database connection...');
  
  // Parse DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not found in .env file');
    process.exit(1);
  }
  
  console.log('📋 Database URL:', dbUrl.replace(/:[^:@]*@/, ':****@'));
  
  try {
    // Connect to PostgreSQL server (without specific database)
    const url = new URL(dbUrl);
    const serverClient = new Client({
      host: url.hostname,
      port: url.port,
      user: url.username,
      password: url.password,
      database: 'postgres' // Connect to default postgres database
    });
    
    await serverClient.connect();
    console.log('✅ Connected to PostgreSQL server');
    
    // Check if our database exists
    const dbName = url.pathname.slice(1).split('?')[0]; // Remove leading slash and query params
    const result = await serverClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    
    if (result.rows.length === 0) {
      console.log(`📝 Creating database: ${dbName}`);
      await serverClient.query(`CREATE DATABASE "${dbName}"`);
      console.log('✅ Database created successfully');
    } else {
      console.log(`✅ Database ${dbName} already exists`);
    }
    
    await serverClient.end();
    
    // Test connection to our specific database
    const appClient = new Client({
      connectionString: dbUrl
    });
    
    await appClient.connect();
    console.log('✅ Connected to application database');
    await appClient.end();
    
    console.log('🎉 Database setup complete! You can now run: npx prisma migrate dev --name init');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your DATABASE_URL in .env file');
    console.log('3. Verify username/password are correct');
    console.log('4. Ensure the PostgreSQL port is correct (usually 5432)');
    process.exit(1);
  }
}

setupDatabase();
