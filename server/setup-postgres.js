const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'chatverse',
    port: process.env.DB_PORT || 5432,
};

const pool = new Pool(dbConfig);

async function setupDatabase() {
    try {
        console.log('🔄 Setting up PostgreSQL database...');
        
        // Read and execute schema
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(schema);
        console.log('✅ Database schema created successfully');
        
        // Test connection
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Database connection test successful');
        console.log('📅 Current database time:', result.rows[0].now);
        
        console.log('\n🎉 PostgreSQL setup completed successfully!');
        console.log('You can now start your server with: npm start');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.error('\nTroubleshooting tips:');
        console.error('1. Make sure PostgreSQL is running');
        console.error('2. Check your database credentials in .env file');
        console.error('3. Ensure the database "chatverse" exists');
        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupDatabase();
