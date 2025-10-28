const { Pool } = require('pg');
require('dotenv').config();

// Database configuration for Render
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

console.log('🔍 Database Configuration:');
console.log('Host:', dbConfig.host);
console.log('User:', dbConfig.user);
console.log('Database:', dbConfig.database);
console.log('Port:', dbConfig.port);
console.log('SSL:', dbConfig.ssl);

const pool = new Pool(dbConfig);

async function setupDatabase() {
    try {
        console.log('🔄 Testing database connection...');

        // Test connection
        const client = await pool.connect();
        console.log('✅ Database connection successful!');

        // Check if database exists
        const dbCheck = await client.query('SELECT current_database()');
        console.log('📊 Connected to database:', dbCheck.rows[0].current_database);

        // Read and execute schema
        const fs = require('fs');
        const path = require('path');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');

        if (fs.existsSync(schemaPath)) {
            console.log('📄 Reading schema file...');
            const schema = fs.readFileSync(schemaPath, 'utf8');

            console.log('🔨 Executing schema...');
            await client.query(schema);
            console.log('✅ Database schema created successfully!');
        } else {
            console.log('⚠️ Schema file not found, creating basic tables...');

            // Create basic tables if schema file doesn't exist
            await client.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    bio TEXT,
                    avatar VARCHAR(255),
                    last_seen TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            await client.query(`
                CREATE TABLE IF NOT EXISTS messages (
                    id SERIAL PRIMARY KEY,
                    sender_id INTEGER NOT NULL,
                    receiver_id INTEGER NOT NULL,
                    message TEXT NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
                );
            `);

            console.log('✅ Basic tables created successfully!');
        }

        // Test a simple query
        const testQuery = await client.query('SELECT NOW() as current_time');
        console.log('🕐 Database time:', testQuery.rows[0].current_time);

        console.log('\n🎉 Database setup completed successfully!');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.error('\n🔍 Troubleshooting tips:');
        console.error('1. Check your environment variables in Render');
        console.error('2. Verify PostgreSQL service is running');
        console.error('3. Check if database exists');
        console.error('4. Verify connection credentials');
        console.error('\n📋 Current environment variables:');
        console.error('DB_HOST:', process.env.DB_HOST);
        console.error('DB_USER:', process.env.DB_USER);
        console.error('DB_NAME:', process.env.DB_NAME);
        console.error('DB_PORT:', process.env.DB_PORT);

        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupDatabase();

