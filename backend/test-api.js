#!/usr/bin/env node

import { spawn } from 'child_process';
import fetch from 'node-fetch';

// Start the server in the background
console.log('🚀 Starting backend server...');
const server = spawn('node', ['server.js'], {
  cwd: process.cwd(),
  detached: true,
  stdio: 'pipe'
});

// Wait a bit for the server to start
await new Promise(resolve => setTimeout(resolve, 3000));

console.log('🔍 Testing API endpoints...');

try {
  // Test health endpoint
  const healthResponse = await fetch('http://localhost:3001/api/health');
  const healthData = await healthResponse.json();
  console.log('✅ Health endpoint:', healthData.status === 'OK' ? 'WORKING' : 'FAILED');

  // Test projects endpoint
  const projectsResponse = await fetch('http://localhost:3001/api/projects');
  const projectsData = await projectsResponse.json();
  console.log('✅ Projects endpoint:', projectsData.success ? 'WORKING' : 'FAILED');
  console.log('📊 Number of projects:', projectsData.data?.projects?.length || 0);

} catch (error) {
  console.error('❌ API test failed:', error.message);
}

// Kill the server
server.kill();
console.log('🛑 Server stopped');
