import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcryptjs from "bcryptjs";
import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Starting database seed...\n");

  try {
    // Clear existing data in correct order to respect foreign key constraints
    console.log("🗑️  Clearing existing data...");
    
    await prisma.parentStudent.deleteMany();
    await prisma.parent.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.class.deleteMany();
    
    console.log("✅ Existing data cleared");

    // Hash passwords
    const adminPassword = await bcryptjs.hash("Admin@123", 10);
    const teacherPassword = await bcryptjs.hash("Teacher@123", 10);
    const studentPassword = await bcryptjs.hash("Student@123", 10);
    const parentPassword = await bcryptjs.hash("Parent@123", 10);

    // ========================
    // Create Admin Users
    // ========================
    console.log("👤 Creating Admin users...");

    const admin1 = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@edupro.com",
        password: adminPassword,
        role: "ADMIN",
        phone: "+1234567890",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin1",
        status: "active",
      },
    });

    await prisma.profile.create({
      data: {
        userId: admin1.id,
        address: "123 Admin Street, City",
        dateOfBirth: new Date("1990-01-15"),
        gender: "MALE",
        bio: "System Administrator",
      },
    });

    console.log(`✅ Admin created: ${admin1.email}`);

    // ========================
    // Create Teacher Users
    // ========================
    console.log("👨‍🏫 Creating Teacher users...");

    const teacher1 = await prisma.user.create({
      data: {
        name: "John Smith",
        email: "john.smith@edupro.com",
        password: teacherPassword,
        role: "TEACHER",
        phone: "+1987654321",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1",
        status: "active",
      },
    });

    await prisma.profile.create({
      data: {
        userId: teacher1.id,
        address: "456 Teacher Avenue, City",
        dateOfBirth: new Date("1985-05-20"),
        gender: "MALE",
        bio: "Mathematics Teacher",
      },
    });

    await prisma.teacher.create({
      data: {
        userId: teacher1.id,
        department: "Mathematics",
        joinDate: new Date("2020-08-01"),
        classesTaken: 3,
      },
    });

    console.log(`✅ Teacher created: ${teacher1.email}`);

    const teacher2 = await prisma.user.create({
      data: {
        name: "Sarah Johnson",
        email: "sarah.johnson@edupro.com",
        password: teacherPassword,
        role: "TEACHER",
        phone: "+1876543210",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2",
        status: "active",
      },
    });

    await prisma.profile.create({
      data: {
        userId: teacher2.id,
        address: "789 Science Lane, City",
        dateOfBirth: new Date("1988-03-10"),
        gender: "FEMALE",
        bio: "Science Teacher",
      },
    });

    await prisma.teacher.create({
      data: {
        userId: teacher2.id,
        department: "Science",
        joinDate: new Date("2019-06-15"),
        classesTaken: 4,
      },
    });

    console.log(`✅ Teacher created: ${teacher2.email}`);

    const teacher3 = await prisma.user.create({
      data: {
        name: "Michael Brown",
        email: "michael.brown@edupro.com",
        password: teacherPassword,
        role: "TEACHER",
        phone: "+1765432109",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher3",
        status: "active",
      },
    });

    await prisma.profile.create({
      data: {
        userId: teacher3.id,
        address: "321 English Road, City",
        dateOfBirth: new Date("1986-07-25"),
        gender: "MALE",
        bio: "English Teacher",
      },
    });

    await prisma.teacher.create({
      data: {
        userId: teacher3.id,
        department: "English",
        joinDate: new Date("2021-09-01"),
        classesTaken: 5,
      },
    });

    console.log(`✅ Teacher created: ${teacher3.email}`);

    // ========================
    // Create Student Users
    // ========================
    console.log("👨‍🎓 Creating Student users...");

    const studentData = [
      {
        name: "Alex Kumar",
        email: "alex.kumar@student.edupro.com",
        phone: "+1654321098",
        section: "A",
        rollNumber: "001",
        grade: "10",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student1",
        dateOfBirth: new Date("2008-02-14"),
        gender: "MALE",
      },
      {
        name: "Emma Williams",
        email: "emma.williams@student.edupro.com",
        phone: "+1543210987",
        section: "A",
        rollNumber: "002",
        grade: "10",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student2",
        dateOfBirth: new Date("2008-05-22"),
        gender: "FEMALE",
      },
      {
        name: "James Davis",
        email: "james.davis@student.edupro.com",
        phone: "+1432109876",
        section: "B",
        rollNumber: "003",
        grade: "10",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student3",
        dateOfBirth: new Date("2008-08-30"),
        gender: "MALE",
      },
      {
        name: "Olivia Martinez",
        email: "olivia.martinez@student.edupro.com",
        phone: "+1321098765",
        section: "B",
        rollNumber: "004",
        grade: "10",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student4",
        dateOfBirth: new Date("2008-11-11"),
        gender: "FEMALE",
      },
      {
        name: "Ethan Anderson",
        email: "ethan.anderson@student.edupro.com",
        phone: "+1210987654",
        section: "C",
        rollNumber: "005",
        grade: "9",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student5",
        dateOfBirth: new Date("2009-03-17"),
        gender: "MALE",
      },
    ];

    // Create a dummy class first
    const dummyClass = await prisma.class.create({
      data: {
        name: "10A",
        section: "A",
        capacity: 40,
      },
    });

    const students = [];
    for (const studentInfo of studentData) {
      const student = await prisma.user.create({
        data: {
          name: studentInfo.name,
          email: studentInfo.email,
          password: studentPassword,
          role: "STUDENT",
          phone: studentInfo.phone,
          avatar: studentInfo.avatar,
          status: "active",
        },
      });

      await prisma.profile.create({
        data: {
          userId: student.id,
          address: `${Math.floor(Math.random() * 1000)} Student Street, City`,
          dateOfBirth: studentInfo.dateOfBirth,
          gender: studentInfo.gender as any,
          bio: `Student in ${studentInfo.section} section`,
        },
      });

      const studentRecord = await prisma.student.create({
        data: {
          userId: student.id,
          classId: dummyClass.id,
          section: studentInfo.section,
          rollNumber: studentInfo.rollNumber,
          admissionDate: new Date("2023-06-01"),
          grade: studentInfo.grade,
        },
      });

      students.push(studentRecord);
      console.log(`✅ Student created: ${student.email}`);
    }

    // ========================
    // Create Parent Users
    // ========================
    console.log("👪 Creating Parent users...");

    const parentData = [
      {
        name: "Rajesh Kumar",
        email: "rajesh.kumar@parent.edupro.com",
        phone: "+1198765432",
        occupation: "Engineer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent1",
        dateOfBirth: new Date("1970-01-10"),
        gender: "MALE",
        studentIndex: 0,
      },
      {
        name: "Priya Williams",
        email: "priya.williams@parent.edupro.com",
        phone: "+1287654321",
        occupation: "Doctor",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent2",
        dateOfBirth: new Date("1972-04-20"),
        gender: "FEMALE",
        studentIndex: 1,
      },
      {
        name: "Robert Davis",
        email: "robert.davis@parent.edupro.com",
        phone: "+1376543210",
        occupation: "Teacher",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent3",
        dateOfBirth: new Date("1968-07-15"),
        gender: "MALE",
        studentIndex: 2,
      },
      {
        name: "Maria Martinez",
        email: "maria.martinez@parent.edupro.com",
        phone: "+1465432109",
        occupation: "Business Owner",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent4",
        dateOfBirth: new Date("1975-09-25"),
        gender: "FEMALE",
        studentIndex: 3,
      },
      {
        name: "David Anderson",
        email: "david.anderson@parent.edupro.com",
        phone: "+1554321098",
        occupation: "Accountant",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent5",
        dateOfBirth: new Date("1970-12-05"),
        gender: "MALE",
        studentIndex: 4,
      },
    ];

    for (const parentInfo of parentData) {
      const parent = await prisma.user.create({
        data: {
          name: parentInfo.name,
          email: parentInfo.email,
          password: parentPassword,
          role: "PARENT",
          phone: parentInfo.phone,
          avatar: parentInfo.avatar,
          status: "active",
        },
      });

      await prisma.profile.create({
        data: {
          userId: parent.id,
          address: `${Math.floor(Math.random() * 1000)} Parent Avenue, City`,
          dateOfBirth: parentInfo.dateOfBirth,
          gender: parentInfo.gender as any,
          bio: parentInfo.occupation,
        },
      });

      const parentRecord = await prisma.parent.create({
        data: {
          userId: parent.id,
          occupation: parentInfo.occupation,
        },
      });

      // Link parent to student
      await prisma.parentStudent.create({
        data: {
          parentId: parentRecord.id,
          studentId: students[parentInfo.studentIndex].id,
        },
      });

      console.log(`✅ Parent created: ${parent.email}`);
    }

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin     | admin@edupro.com              | Admin@123");
    console.log("Teacher   | john.smith@edupro.com        | Teacher@123");
    console.log("Student   | alex.kumar@student.edupro.com | Student@123");
    console.log("Parent    | rajesh.kumar@parent.edupro.com| Parent@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
