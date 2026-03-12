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
    
    await prisma.activityLog.deleteMany();
    await prisma.feePayment.deleteMany();
    await prisma.feeStructure.deleteMany();
    await prisma.questionPaper.deleteMany();
    await prisma.examResult.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.notice.deleteMany();
    await prisma.teacherClass.deleteMany();
    await prisma.teacherSubject.deleteMany();
    await prisma.classSubject.deleteMany();
    await prisma.parentStudent.deleteMany();
    await prisma.parent.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.class.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    
    console.log("✅ Existing data cleared");

    // Hash passwords
    const adminPassword = await bcryptjs.hash("Admin@123", 10);
    const teacherPassword = await bcryptjs.hash("Teacher@123", 10);
    const studentPassword = await bcryptjs.hash("Student@123", 10);
    const parentPassword = await bcryptjs.hash("Parent@123", 10);

    // ========================
    // Create Subjects
    // ========================
    console.log("📚 Creating Subjects...");

    const subjectData = [
      { name: "Mathematics", code: "MATH101" },
      { name: "Science", code: "SCI101" },
      { name: "English", code: "ENG101" },
      { name: "History", code: "HIS101" },
      { name: "Computer Science", code: "CS101" },
      { name: "Physical Education", code: "PE101" },
    ];

    const subjects = [];
    for (const subjectInfo of subjectData) {
      const subject = await prisma.subject.create({
        data: {
          name: subjectInfo.name,
          code: subjectInfo.code,
        },
      });
      subjects.push(subject);
    }
    console.log(`✅ ${subjects.length} Subjects created`);

    // ========================
    // Create Classes
    // ========================
    console.log("🏫 Creating Classes...");

    const classData = [
      { name: "10", section: "A", capacity: 40 },
      { name: "10", section: "B", capacity: 40 },
      { name: "9", section: "A", capacity: 40 },
      { name: "9", section: "B", capacity: 40 },
      { name: "8", section: "A", capacity: 40 },
    ];

    const classes = [];
    for (const classInfo of classData) {
      const classRecord = await prisma.class.create({
        data: {
          name: classInfo.name,
          section: classInfo.section,
          capacity: classInfo.capacity,
        },
      });
      classes.push(classRecord);
    }
    console.log(`✅ ${classes.length} Classes created`);

    // ========================
    // Create Admin User
    // ========================
    console.log("👤 Creating Admin user...");

    const admin1 = await prisma.user.create({
      data: {
        name: "John Anderson",
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
    // Create Teachers
    // ========================
    console.log("👨‍🏫 Creating Teachers...");

    const teacherData = [
      {
        name: "Emily Carter",
        email: "emily.carter@school.com",
        phone: "+15550000",
        department: "Science",
        joinDate: new Date("2023-01-15"),
        subjectIndices: [1, 4], // Science, Computer Science
        classIndices: [0],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1",
      },
      {
        name: "David Park",
        email: "david.park@school.com",
        phone: "+15551111",
        department: "Language Arts",
        joinDate: new Date("2022-06-10"),
        subjectIndices: [2, 3], // English, History
        classIndices: [0, 1],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2",
      },
      {
        name: "Rachel Kim",
        email: "rachel.kim@school.com",
        phone: "+15552222",
        department: "Science",
        joinDate: new Date("2023-08-01"),
        subjectIndices: [1, 4], // Science, Computer Science
        classIndices: [2, 3],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher3",
      },
      {
        name: "Michael Chen",
        email: "michael.chen@school.com",
        phone: "+15553333",
        department: "Social Studies",
        joinDate: new Date("2021-09-05"),
        subjectIndices: [3], // History
        classIndices: [1, 4],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher4",
      },
      {
        name: "Lisa Anderson",
        email: "lisa.anderson@school.com",
        phone: "+15554444",
        department: "Technology",
        joinDate: new Date("2023-02-20"),
        subjectIndices: [4], // Computer Science
        classIndices: [2],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher5",
      },
      {
        name: "James Wright",
        email: "james.wright@school.com",
        phone: "+15555555",
        department: "Physical Education",
        joinDate: new Date("2022-04-15"),
        subjectIndices: [5], // Physical Education
        classIndices: [3],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher6",
      },
    ];

    const teachers = [];
    for (const teacherInfo of teacherData) {
      const teacher = await prisma.user.create({
        data: {
          name: teacherInfo.name,
          email: teacherInfo.email,
          password: teacherPassword,
          role: "TEACHER",
          phone: teacherInfo.phone,
          avatar: teacherInfo.avatar,
          status: "active",
        },
      });

      await prisma.profile.create({
        data: {
          userId: teacher.id,
          address: `${Math.floor(Math.random() * 1000)} Teacher Street, City`,
          dateOfBirth: new Date("1985-06-10"),
          gender: "FEMALE",
        },
      });

      const teacherRecord = await prisma.teacher.create({
        data: {
          userId: teacher.id,
          department: teacherInfo.department,
          joinDate: teacherInfo.joinDate,
          classesTaken: teacherInfo.classIndices.length,
        },
      });

      // Assign subjects to teacher
      for (const subjectIndex of teacherInfo.subjectIndices) {
        await prisma.teacherSubject.create({
          data: {
            teacherId: teacherRecord.id,
            subjectId: subjects[subjectIndex].id,
          },
        });
      }

      // Assign classes to teacher
      for (const classIndex of teacherInfo.classIndices) {
        await prisma.teacherClass.create({
          data: {
            teacherId: teacherRecord.id,
            classId: classes[classIndex].id,
          },
        });
      }

      teachers.push(teacherRecord);
      console.log(`✅ Teacher created: ${teacher.email}`);
    }

    // ========================
    // Create Students
    // ========================
    console.log("👨‍🎓 Creating Students...");

    const studentData = [
      { name: "Sarah Johnson", email: "sarah@school.com", phone: "+16650101", section: "A", rollNumber: "101", class: 0, grade: "A", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student1", dateOfBirth: new Date("2008-03-15"), gender: "FEMALE" },
      { name: "James Williams", email: "james@school.com", phone: "+16650102", section: "A", rollNumber: "102", class: 0, grade: "B+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student2", dateOfBirth: new Date("2008-07-22"), gender: "MALE" },
      { name: "Emma Davis", email: "emma@school.com", phone: "+16650103", section: "B", rollNumber: "201", class: 1, grade: "A-", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student3", dateOfBirth: new Date("2008-11-09"), gender: "FEMALE" },
      { name: "Liam Martinez", email: "liam@school.com", phone: "+16650104", section: "A", rollNumber: "202", class: 2, grade: "B", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student4", dateOfBirth: new Date("2009-02-14"), gender: "MALE" },
      { name: "Olivia Brown", email: "olivia@school.com", phone: "+16650105", section: "A", rollNumber: "301", class: 2, grade: "A+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student5", dateOfBirth: new Date("2009-05-20"), gender: "FEMALE" },
      { name: "Noah Wilson", email: "noah@school.com", phone: "+16650106", section: "B", rollNumber: "302", class: 3, grade: "B+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student6", dateOfBirth: new Date("2009-08-30"), gender: "MALE" },
      { name: "Ava Taylor", email: "ava@school.com", phone: "+16650107", section: "A", rollNumber: "401", class: 4, grade: "A", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student7", dateOfBirth: new Date("2010-01-10"), gender: "FEMALE" },
      { name: "Ethan Moore", email: "ethan@school.com", phone: "+16650108", section: "B", rollNumber: "103", class: 0, grade: "C+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student8", dateOfBirth: new Date("2008-04-25"), gender: "MALE" },
    ];

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
        },
      });

      const studentRecord = await prisma.student.create({
        data: {
          userId: student.id,
          classId: classes[studentInfo.class].id,
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
    // Create Parents
    // ========================
    console.log("👪 Creating Parents...");

    const parentData = [
      { name: "Michael Johnson", email: "michael@email.com", phone: "+16750100", occupation: "Engineer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent1", dateOfBirth: new Date("1970-01-10"), gender: "MALE", studentIndex: 0 },
      { name: "Lisa Davis", email: "lisa@email.com", phone: "+16750101", occupation: "Doctor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent2", dateOfBirth: new Date("1972-05-15"), gender: "FEMALE", studentIndex: 1 },
      { name: "Robert Martinez", email: "robert@email.com", phone: "+16750102", occupation: "Teacher", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent3", dateOfBirth: new Date("1968-09-20"), gender: "MALE", studentIndex: 2 },
      { name: "Jennifer Brown", email: "jennifer@email.com", phone: "+16750103", occupation: "Nurse", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent4", dateOfBirth: new Date("1975-03-25"), gender: "FEMALE", studentIndex: 3 },
      { name: "William Wilson", email: "william@email.com", phone: "+16750104", occupation: "Manager", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent5", dateOfBirth: new Date("1970-11-30"), gender: "MALE", studentIndex: 4 },
      { name: "Maria Taylor", email: "maria@email.com", phone: "+16750105", occupation: "Accountant", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent6", dateOfBirth: new Date("1973-07-10"), gender: "FEMALE", studentIndex: 5 },
      { name: "David Moore", email: "david@email.com", phone: "+16750106", occupation: "Businessman", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent7", dateOfBirth: new Date("1971-02-18"), gender: "MALE", studentIndex: 6 },
      { name: "Sarah Anderson", email: "sarah@email.com", phone: "+16750107", occupation: "Lawyer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent8", dateOfBirth: new Date("1974-06-22"), gender: "FEMALE", studentIndex: 7 },
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

    // ========================
    // Assign Classes & Subjects to Classes
    // ========================
    console.log("📖 Assigning Subjects to Classes...");

    for (let i = 0; i < classes.length; i++) {
      for (let j = 0; j < 5; j++) {
        await prisma.classSubject.create({
          data: {
            classId: classes[i].id,
            subjectId: subjects[j].id,
          },
        });
      }
    }
    console.log("✅ Subjects assigned to classes");

    // ========================
    // Create Attendance Records
    // ========================
    console.log("✔️  Creating Attendance Records...");

    const today = new Date();
    for (let i = 0; i < students.length; i++) {
      for (let j = 0; j < 20; j++) {
        const date = new Date(today);
        date.setDate(date.getDate() - j);

        const statuses = ["PRESENT", "ABSENT", "LATE"];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        await prisma.attendance.create({
          data: {
            studentId: students[i].id,
            classId: classes[0].id,
            date: date,
            status: randomStatus as any,
            markedBy: teachers[0].id,
          },
        });
      }
    }
    console.log("✅ Attendance records created");

    // ========================
    // Create Notices
    // ========================
    console.log("📢 Creating Notices...");

    const notices = [
      {
        title: "Mid-term Exam Schedule",
        message: "Mid-term exams will be held from March 15-27, 2026",
        category: "exam",
      },
      {
        title: "Annual Sports Day",
        message: "School sports day will be held on April 10, 2026. All students are requested to participate.",
        category: "event",
      },
      {
        title: "Parent-Teacher Meeting",
        message: "Parents are invited for PTM on March 20, 2026 at 3:00 PM",
        category: "general",
      },
      {
        title: "School Holiday",
        message: "School will remain closed on March 8-9, 2026 for National Holiday",
        category: "holiday",
      },
    ];

    for (const noticeData of notices) {
      await prisma.notice.create({
        data: {
          title: noticeData.title,
          message: noticeData.message,
          category: noticeData.category,
          priority: "normal",
          pinned: false,
          createdBy: admin1.id,
        },
      });
    }
    console.log(`✅ ${notices.length} Notices created`);

    // ========================
    // Create Exams
    // ========================
    console.log("📝 Creating Exams...");

    const examData = [
      { name: "Mid-term Math", classId: 0, subjectId: 0, date: new Date("2026-03-20"), totalMarks: 100, duration: "2 hours", type: "MONTHLY" },
      { name: "Mid-term Science", classId: 0, subjectId: 1, date: new Date("2026-03-22"), totalMarks: 100, duration: "2 hours", type: "MONTHLY" },
      { name: "Mid-term English", classId: 1, subjectId: 2, date: new Date("2026-03-25"), totalMarks: 100, duration: "2 hours", type: "MONTHLY" },
    ];

    const exams = [];
    for (const examInfo of examData) {
      const exam = await prisma.exam.create({
        data: {
          name: examInfo.name,
          classId: classes[examInfo.classId].id,
          subjectId: subjects[examInfo.subjectId].id,
          date: examInfo.date,
          totalMarks: examInfo.totalMarks,
          duration: examInfo.duration,
          type: examInfo.type as any,
        },
      });
      exams.push(exam);
    }
    console.log(`✅ ${exams.length} Exams created`);

    // ========================
    // Create Exam Results
    // ========================
    console.log("📊 Creating Exam Results...");

    for (let examIdx = 0; examIdx < exams.length; examIdx++) {
      for (let studentIdx = 0; studentIdx < 4; studentIdx++) {
        const marksObtained = Math.floor(Math.random() * 40) + 60; // Random marks between 60-100

        await prisma.examResult.create({
          data: {
            examId: exams[examIdx].id,
            studentId: students[studentIdx].id,
            marksObtained: marksObtained,
            grade: marksObtained >= 90 ? "A+" : marksObtained >= 80 ? "A" : marksObtained >= 70 ? "B" : "C",
            remarks: "Good performance",
          },
        });
      }
    }
    console.log("✅ Exam results created");

    // ========================
    // Create Fee Structures
    // ========================
    console.log("💰 Creating Fee Structures...");

    for (const classRecord of classes) {
      await prisma.feeStructure.create({
        data: {
          classId: classRecord.id,
          feeType: "MONTHLY",
          amount: 5000,
        },
      });
    }
    console.log("✅ Fee structures created");

    // ========================
    // Create Fee Payments
    // ========================
    console.log("💳 Creating Fee Payments...");

    for (let i = 0; i < students.length; i++) {
      const feeStructure = await prisma.feeStructure.findFirst({
        where: { classId: students[i].classId },
      });

      if (feeStructure) {
        // Create 2-3 payments for each student
        for (let j = 0; j < 2; j++) {
          await prisma.feePayment.create({
            data: {
              studentId: students[i].id,
              feeStructureId: feeStructure.id,
              amountPaid: feeStructure.amount,
              paymentDate: new Date(Date.now() - j * 30 * 24 * 60 * 60 * 1000),
              status: j === 0 ? "PAID" : "UNPAID",
            },
          });
        }
      }
    }
    console.log("✅ Fee payments created");

    // ========================
    // Create Activity Logs
    // ========================
    console.log("📋 Creating Activity Logs...");

    const activities = [
      { action: "user_login", userId: admin1.id, description: "Admin logged in" },
      { action: "student_created", userId: admin1.id, description: `Created student: ${studentData[0].name}` },
      { action: "class_created", userId: admin1.id, description: `Created class: ${classes[0].name}-${classes[0].section}` },
      { action: "exam_created", userId: teachers[0].id, description: `Created exam: ${examData[0].name}` },
      { action: "notice_posted", userId: admin1.id, description: notices[0].title },
    ];

    for (const activity of activities) {
      await prisma.activityLog.create({
        data: {
          action: activity.action as any,
          userId: activity.userId,
          description: activity.description,
        },
      });
    }
    console.log("✅ Activity logs created");

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin     | admin@edupro.com         | Admin@123");
    console.log("Teacher   | emily.carter@school.com  | Teacher@123");
    console.log("Student   | sarah@school.com         | Student@123");
    console.log("Parent    | michael@email.com        | Parent@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("📊 Seeded Data Summary:");
    console.log("  • Users: 1 Admin, 6 Teachers, 8 Students, 8 Parents");
    console.log("  • Classes: 5 (10-A, 10-B, 9-A, 9-B, 8-A)");
    console.log("  • Subjects: 6 (Math, Science, English, History, CS, PE)");
    console.log("  • Exams: 3 with results");
    console.log("  • Attendance: 160+ records");
    console.log("  • Notices: 4");
    console.log("  • Fee Structures & Payments: Configured");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
