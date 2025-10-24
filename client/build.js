const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting build process...');

try {
    // Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Build the app
    console.log('🔨 Building application...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('✅ Build completed successfully!');
    console.log('📁 Built files are in ./dist directory');

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
