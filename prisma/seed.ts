import "dotenv/config";
import { prisma } from "../lib/prisma";
import { UserRole } from "../prisma/generated/prisma/enums";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing users (optional - comment out if you want to keep existing data)
  // await prisma.user.deleteMany({});

  // Hash passwords
  const adminPassword = await bcrypt.hash("admin@123", 10);
  const teacherPassword = await bcrypt.hash("teacher@123", 10);
  const studentPassword = await bcrypt.hash("student@123", 10);
  const parentPassword = await bcrypt.hash("parent@123", 10);

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@edupro.com" },
    update: {},
    create: {
      email: "admin@edupro.com",
      password: adminPassword,
      name: "Admin User",
      role: UserRole.ADMIN,
      phone: "+1-800-000-0001",
      status: "active",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create Teacher user
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@edupro.com" },
    update: {},
    create: {
      email: "teacher@edupro.com",
      password: teacherPassword,
      name: "Teacher User",
      role: UserRole.TEACHER,
      phone: "+1-800-000-0002",
      status: "active",
    },
  });
  console.log("✅ Teacher created:", teacher.email);

  // Create Student user
  const student = await prisma.user.upsert({
    where: { email: "student@edupro.com" },
    update: {},
    create: {
      email: "student@edupro.com",
      password: studentPassword,
      name: "Student User",
      role: UserRole.STUDENT,
      phone: "+1-800-000-0003",
      status: "active",
    },
  });
  console.log("✅ Student created:", student.email);

  // Create Parent user
  const parent = await prisma.user.upsert({
    where: { email: "parent@edupro.com" },
    update: {},
    create: {
      email: "parent@edupro.com",
      password: parentPassword,
      name: "Parent User",
      role: UserRole.PARENT,
      phone: "+1-800-000-0004",
      status: "active",
    },
  });
  console.log("✅ Parent created:", parent.email);

  console.log("\n📋 Test Credentials:");
  console.log("=".repeat(50));
  console.log("\n🔐 ADMIN");
  console.log("   Email: admin@edupro.com");
  console.log("   Password: admin@123");
  console.log("\n🔐 TEACHER");
  console.log("   Email: teacher@edupro.com");
  console.log("   Password: teacher@123");
  console.log("\n🔐 STUDENT");
  console.log("   Email: student@edupro.com");
  console.log("   Password: student@123");
  console.log("\n🔐 PARENT");
  console.log("   Email: parent@edupro.com");
  console.log("   Password: parent@123");
  console.log("\n" + "=".repeat(50));
  console.log("✨ Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
