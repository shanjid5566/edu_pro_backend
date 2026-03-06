import "dotenv/config";

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api/${process.env.API_VERSION || "v1"}`;

async function testLogin(email: string, role: string) {
  console.log(`\n🧪 Testing login for ${role}: ${email}`);

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: `${role}@123`, // Passwords from seed.ts
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(
        `✅ Success! Token received: ${data.data.token.substring(0, 20)}...`,
      );
      console.log(
        `👤 User data:`,
        data.data.user.name,
        `| Role:`,
        data.data.user.role,
      );
    } else {
      console.error(`❌ Failed:`, data);
    }
  } catch (error) {
    console.error(`💥 Error testing ${role}:`, error);
  }
}

async function runTests() {
  console.log(`🚀 Starting Login API Tests against ${BASE_URL}...`);

  await testLogin("admin@edupro.com", "Admin");
  await testLogin("john.smith@edupro.com", "Teacher");
  await testLogin("alex.kumar@student.edupro.com", "Student");
  await testLogin("rajesh.kumar@parent.edupro.com", "Parent");

  // Test invalid login
  console.log(`\n🧪 Testing invalid login...`);
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@edupro.com",
        password: "wrongpassword",
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.log(`✅ Invalid login correctly rejected: ${data.message}`);
    } else {
      console.error(
        `❌ Failed: Invalid login succeeded when it shouldn't have.`,
      );
    }
  } catch (error) {
    console.error(`💥 Error testing invalid login:`, error);
  }
}

runTests();
