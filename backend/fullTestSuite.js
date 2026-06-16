/**
 * Comprehensive API Test Suite
 * اختبار شامل لجميع API endpoints
 */

import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) =>
    console.log(`\n${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
${colors.yellow}${msg}${colors.reset}
${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`),
};

// Create axios instance with timeout
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

async function runTests() {
  let token = null;
  let testsPassed = 0;
  let testsFailed = 0;

  try {
    log.header("🧪 AAKhadanaty API Test Suite");

    // Test 1: Health Check
    log.header("Test 1: Health Check");
    try {
      const response = await api.get("/health");
      if (response.data.success && response.data.dbConnected) {
        log.success("Health check passed");
        console.log(`  Status: ${response.data.message}`);
        console.log(`  DB Connected: ${response.data.dbConnected}`);
        testsPassed++;
      } else {
        log.error("Health check failed - DB not connected");
        testsFailed++;
      }
    } catch (error) {
      log.error(`Health check error: ${error.message}`);
      testsFailed++;
    }

    // Test 2: User Registration
    log.header("Test 2: User Registration");
    try {
      const userData = {
        name: "Test User",
        email: `testuser_${Date.now()}@test.com`,
        phone: "0123456789",
        password: "Test1234!",
      };

      const response = await api.post("/auth/register", userData);
      if (response.data.success) {
        log.success("User registration passed");
        console.log(`  Email: ${userData.email}`);
        testsPassed++;
      } else {
        log.error(`Registration failed: ${response.data.message}`);
        testsFailed++;
      }
    } catch (error) {
      log.error(`Registration error: ${error.response?.data?.message || error.message}`);
      testsFailed++;
    }

    // Test 3: Admin Login
    log.header("Test 3: Admin Login");
    try {
      const response = await api.post("/auth/login", {
        email: "admin@a5adamaty.com",
        password: "admin12345678",
      });

      if (response.data.success && response.data.token) {
        token = response.data.token;
        log.success("Admin login passed");
        console.log(`  User: ${response.data.user.email}`);
        console.log(`  Role: ${response.data.user.role}`);
        console.log(`  Token: ${token.substring(0, 20)}...`);
        testsPassed++;
      } else {
        log.error(`Login failed: ${response.data.message}`);
        testsFailed++;
      }
    } catch (error) {
      log.error(`Login error: ${error.response?.data?.message || error.message}`);
      testsFailed++;
    }

    // Test 4: Get Current User (Protected Route)
    if (token) {
      log.header("Test 4: Get Current User (Protected)");
      try {
        const response = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          log.success("Protected route access passed");
          console.log(`  User: ${response.data.user.email}`);
          console.log(`  Name: ${response.data.user.name}`);
          testsPassed++;
        } else {
          log.error(`Protected route failed: ${response.data.message}`);
          testsFailed++;
        }
      } catch (error) {
        log.error(`Protected route error: ${error.message}`);
        testsFailed++;
      }
    }

    // Test 5: Get All Users
    if (token) {
      log.header("Test 5: Get All Users");
      try {
        const response = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          log.success("Get users passed");
          console.log(`  Total Users: ${response.data.data.length}`);
          testsPassed++;
        } else {
          log.error(`Get users failed: ${response.data.message}`);
          testsFailed++;
        }
      } catch (error) {
        log.error(`Get users error: ${error.response?.data?.message || error.message}`);
        testsFailed++;
      }
    }

    // Test 6: Get Providers
    log.header("Test 6: Get Service Providers");
    try {
      const response = await api.get("/providers");

      if (response.data.success !== undefined) {
        log.success("Get providers endpoint responded");
        console.log(`  Status: ${response.status}`);
        testsPassed++;
      } else {
        log.error("Unexpected response format");
        testsFailed++;
      }
    } catch (error) {
      // This might fail if no providers exist, which is OK
      if (error.response?.status === 404) {
        log.info("No providers found (expected)");
        testsPassed++;
      } else {
        log.error(`Get providers error: ${error.message}`);
        testsFailed++;
      }
    }

    // Final Report
    log.header("📊 Test Summary");
    console.log(`  ${colors.green}Passed: ${testsPassed}${colors.reset}`);
    console.log(`  ${colors.red}Failed: ${testsFailed}${colors.reset}`);
    console.log(`  Total: ${testsPassed + testsFailed}`);

    if (testsFailed === 0) {
      console.log(`\n${colors.green}🎉 All tests passed!${colors.reset}`);
      process.exit(0);
    } else {
      console.log(`\n${colors.red}⚠️  Some tests failed${colors.reset}`);
      process.exit(1);
    }
  } catch (error) {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  }
}

// Run tests
console.log("⏳ Waiting for server...");
setTimeout(() => {
  runTests();
}, 2000);
