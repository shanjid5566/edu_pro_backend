import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await (prisma as any).chatMessage.deleteMany({});
    await (prisma as any).notification.deleteMany({});
    await (prisma as any).activityLog.deleteMany({});
    await (prisma as any).notificationPreference.deleteMany({});
    await (prisma as any).userPreference.deleteMany({});
    await (prisma as any).notice.deleteMany({});
    await (prisma as any).attendance.deleteMany({});
    await (prisma as any).examResult.deleteMany({});
    await (prisma as any).questionPaper.deleteMany({});
    await (prisma as any).exam.deleteMany({});
    await (prisma as any).feePayment.deleteMany({});
    await (prisma as any).feeStructure.deleteMany({});
    await (prisma as any).parentStudent.deleteMany({});
    await (prisma as any).classSchedule.deleteMany({});
    await (prisma as any).teacherClass.deleteMany({});
    await (prisma as any).teacherSubject.deleteMany({});
    await (prisma as any).classSubject.deleteMany({});
    await (prisma as any).student.deleteMany({});
    await (prisma as any).teacher.deleteMany({});
    await (prisma as any).parent.deleteMany({});
    await (prisma as any).class.deleteMany({});
    await (prisma as any).subject.deleteMany({});
    await (prisma as any).profile.deleteMany({});
    await (prisma as any).user.deleteMany({});
    console.log("✓ Data cleared\n");

  // Hash passwords
  const hashedPassword = await bcrypt.hash("password123", 10);

  // ===== USERS =====
  console.log("👥 Creating users...");

  // Admin
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@edupro.com",
      password: hashedPassword,
      role: "ADMIN",
      phone: "+1234567890",
      status: "active",
      profile: {
        create: {
          address: "School Office, Main Street",
          dateOfBirth: new Date("1980-05-15"),
          gender: "MALE",
        },
      },
      userPreference: { create: { theme: "light" } },
      notificationPreference: { create: {} },
    },
  });

  // Teachers
  const teacher1User = await prisma.user.create({
    data: {
      name: "Sarah Johnson",
      email: "sarah@edupro.com",
      password: hashedPassword,
      role: "TEACHER",
      phone: "+1234567891",
      status: "active",
      profile: {
        create: {
          address: "123 Oak Street",
          dateOfBirth: new Date("1985-03-20"),
          gender: "FEMALE",
        },
      },
      userPreference: { create: { theme: "light" } },
      notificationPreference: { create: {} },
    },
  });

  const teacher2User = await prisma.user.create({
    data: {
      name: "Michael Brown",
      email: "michael@edupro.com",
      password: hashedPassword,
      role: "TEACHER",
      phone: "+1234567892",
      status: "active",
      profile: {
        create: {
          address: "456 Pine Avenue",
          dateOfBirth: new Date("1988-07-10"),
          gender: "MALE",
        },
      },
      userPreference: { create: { theme: "dark" } },
      notificationPreference: { create: {} },
    },
  });

  const teacher3User = await prisma.user.create({
    data: {
      name: "Emily Davis",
      email: "emily@edupro.com",
      password: hashedPassword,
      role: "TEACHER",
      phone: "+1234567893",
      status: "active",
      profile: {
        create: {
          address: "789 Maple Road",
          dateOfBirth: new Date("1990-01-25"),
          gender: "FEMALE",
        },
      },
      userPreference: { create: { theme: "light" } },
      notificationPreference: { create: {} },
    },
  });

  // Parents
  const parent1User = await prisma.user.create({
    data: {
      name: "Michael Davis",
      email: "parent@edupro.com",
      password: hashedPassword,
      role: "PARENT",
      phone: "+1234567894",
      status: "active",
      profile: {
        create: {
          address: "321 Elm Street",
          dateOfBirth: new Date("1970-11-05"),
          gender: "MALE",
        },
      },
      userPreference: { create: { theme: "light" } },
      notificationPreference: { create: {} },
    },
  });

  const parent2User = await prisma.user.create({
    data: {
      name: "Jennifer Wilson",
      email: "jennifer@edupro.com",
      password: hashedPassword,
      role: "PARENT",
      phone: "+1234567895",
      status: "active",
      profile: {
        create: {
          address: "654 Birch Lane",
          dateOfBirth: new Date("1972-04-18"),
          gender: "FEMALE",
        },
      },
      userPreference: { create: { theme: "light" } },
      notificationPreference: { create: {} },
    },
  });

  const parent3User = await prisma.user.create({
    data: {
      name: "Robert Martinez",
      email: "robert@edupro.com",
      password: hashedPassword,
      role: "PARENT",
      phone: "+1234567896",
      status: "active",
      profile: {
        create: {
          address: "987 Cedar Drive",
          dateOfBirth: new Date("1968-09-30"),
          gender: "MALE",
        },
      },
      userPreference: { create: { theme: "light" } },
      notificationPreference: { create: {} },
    },
  });

  // Students
  const student1User = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "alice.johnson@edupro.com",
      password: hashedPassword,
      role: "STUDENT",
      phone: "+1234567897",
      status: "active",
      profile: {
        create: {
          address: "321 Elm Street",
          dateOfBirth: new Date("2010-05-12"),
          gender: "FEMALE",
          bio: "Excellent student, loves mathematics",
        },
      },
      userPreference: { create: { theme: "light" } },
      notificationPreference: { create: {} },
    },
  });

  const student2User = await prisma.user.create({
    data: {
      name: "Bob Wilson",
      email: "bob.wilson@edupro.com",
      password: hashedPassword,
      role: "STUDENT",
      phone: "+1234567898",
      status: "active",
      profile: {
        create: {
          address: "654 Birch Lane",
          dateOfBirth: new Date("2010-08-22"),
          gender: "MALE",
          bio: "Sports enthusiast and smart student",
        },
      },
      userPreference: { create: { theme: "dark" } },
      notificationPreference: { create: {} },
    },
  });

  const student3User = await prisma.user.create({
    data: {
      name: "Carol Martinez",
      email: "carol.martinez@edupro.com",
      password: hashedPassword,
      role: "STUDENT",
      phone: "+1234567899",
      status: "active",
      profile: {
        create: {
          address: "987 Cedar Drive",
          dateOfBirth: new Date("2011-02-14"),
          gender: "FEMALE",
          bio: "Creative writer and artist",
        },
      },
      userPreference: { create: { theme: "light" } },
      notificationPreference: { create: {} },
    },
  });

  const student4User = await prisma.user.create({
    data: {
      name: "David Lee",
      email: "david.lee@edupro.com",
      password: hashedPassword,
      role: "STUDENT",
      phone: "+1234567800",
      status: "active",
      profile: {
        create: {
          address: "111 Spruce Way",
          dateOfBirth: new Date("2011-06-08"),
          gender: "MALE",
          bio: "Coding enthusiast",
        },
      },
      userPreference: { create: { theme: "dark" } },
      notificationPreference: { create: {} },
    },
  });

  const student5User = await prisma.user.create({
    data: {
      name: "Emma Thompson",
      email: "emma.thompson@edupro.com",
      password: hashedPassword,
      role: "STUDENT",
      phone: "+1234567801",
      status: "active",
      profile: {
        create: {
          address: "222 Willow Street",
          dateOfBirth: new Date("2010-09-19"),
          gender: "FEMALE",
          bio: "Science lover",
        },
      },
      userPreference: { create: { theme: "light" } },
      notificationPreference: { create: {} },
    },
  });

  const student6User = await prisma.user.create({
    data: {
      name: "Frank Garcia",
      email: "frank.garcia@edupro.com",
      password: hashedPassword,
      role: "STUDENT",
      phone: "+1234567802",
      status: "active",
      profile: {
        create: {
          address: "333 Ash Avenue",
          dateOfBirth: new Date("2011-03-27"),
          gender: "MALE",
          bio: "Math wizard",
        },
      },
      userPreference: { create: { theme: "light" } },
      notificationPreference: { create: {} },
    },
  });

  console.log("✓ 13 users created (1 admin, 3 teachers, 3 parents, 6 students)\n");

  // ===== TEACHERS =====
  console.log("👨‍🏫 Creating teachers...");

  const teacher1 = await prisma.teacher.create({
    data: {
      userId: teacher1User.id,
      department: "Mathematics",
      joinDate: new Date("2020-08-01"),
      classesTaken: 2,
    },
  });

  const teacher2 = await prisma.teacher.create({
    data: {
      userId: teacher2User.id,
      department: "Science",
      joinDate: new Date("2019-08-15"),
      classesTaken: 3,
    },
  });

  const teacher3 = await prisma.teacher.create({
    data: {
      userId: teacher3User.id,
      department: "English",
      joinDate: new Date("2021-08-01"),
      classesTaken: 2,
    },
  });

  console.log("✓ 3 teachers created\n");

  // ===== SUBJECTS =====
  console.log("📚 Creating subjects...");

  const math = await prisma.subject.create({
    data: { name: "Mathematics", code: "MATH101" },
  });

  const science = await prisma.subject.create({
    data: { name: "Science", code: "SCI101" },
  });

  const english = await prisma.subject.create({
    data: { name: "English", code: "ENG101" },
  });

  const history = await prisma.subject.create({
    data: { name: "History", code: "HIS101" },
  });

  const geography = await prisma.subject.create({
    data: { name: "Geography", code: "GEO101" },
  });

  console.log("✓ 5 subjects created\n");

  // ===== CLASSES =====
  console.log("🏫 Creating classes...");

  const class10A = await prisma.class.create({
    data: {
      name: "10",
      section: "A",
      classTeacherId: teacher1.id,
      capacity: 40,
    },
  });

  const class10B = await prisma.class.create({
    data: {
      name: "10",
      section: "B",
      classTeacherId: teacher2.id,
      capacity: 40,
    },
  });

  console.log("✓ 2 classes created\n");

  // ===== CLASS SUBJECTS =====
  console.log("📖 Creating class subjects...");

  await prisma.classSubject.createMany({
    data: [
      { classId: class10A.id, subjectId: math.id },
      { classId: class10A.id, subjectId: science.id },
      { classId: class10A.id, subjectId: english.id },
      { classId: class10A.id, subjectId: history.id },
      { classId: class10A.id, subjectId: geography.id },
      { classId: class10B.id, subjectId: math.id },
      { classId: class10B.id, subjectId: science.id },
      { classId: class10B.id, subjectId: english.id },
      { classId: class10B.id, subjectId: history.id },
      { classId: class10B.id, subjectId: geography.id },
    ],
  });

  console.log("✓ 10 class-subject relationships created\n");

  // ===== TEACHER SUBJECTS =====
  console.log("👨‍🏫 Creating teacher subjects...");

  await prisma.teacherSubject.createMany({
    data: [
      { teacherId: teacher1.id, subjectId: math.id },
      { teacherId: teacher2.id, subjectId: science.id },
      { teacherId: teacher3.id, subjectId: english.id },
    ],
  });

  console.log("✓ 3 teacher-subject relationships created\n");

  // ===== TEACHER CLASSES =====
  console.log("👨‍🏫 Creating teacher classes...");

  await prisma.teacherClass.createMany({
    data: [
      { teacherId: teacher1.id, classId: class10A.id },
      { teacherId: teacher2.id, classId: class10A.id },
      { teacherId: teacher3.id, classId: class10A.id },
      { teacherId: teacher1.id, classId: class10B.id },
      { teacherId: teacher2.id, classId: class10B.id },
    ],
  });

  console.log("✓ 5 teacher-class relationships created\n");

  // ===== STUDENTS =====
  console.log("🎓 Creating students...");

  const student1 = await prisma.student.create({
    data: {
      userId: student1User.id,
      classId: class10A.id,
      section: "A",
      rollNumber: "10A001",
      admissionDate: new Date("2020-04-01"),
      grade: "A+",
    },
  });

  const student2 = await prisma.student.create({
    data: {
      userId: student2User.id,
      classId: class10A.id,
      section: "A",
      rollNumber: "10A002",
      admissionDate: new Date("2020-04-01"),
      grade: "A",
    },
  });

  const student3 = await prisma.student.create({
    data: {
      userId: student3User.id,
      classId: class10B.id,
      section: "B",
      rollNumber: "10B001",
      admissionDate: new Date("2020-04-01"),
      grade: "A",
    },
  });

  const student4 = await prisma.student.create({
    data: {
      userId: student4User.id,
      classId: class10A.id,
      section: "A",
      rollNumber: "10A003",
      admissionDate: new Date("2020-04-01"),
      grade: "B+",
    },
  });

  const student5 = await prisma.student.create({
    data: {
      userId: student5User.id,
      classId: class10B.id,
      section: "B",
      rollNumber: "10B002",
      admissionDate: new Date("2020-04-01"),
      grade: "A+",
    },
  });

  const student6 = await prisma.student.create({
    data: {
      userId: student6User.id,
      classId: class10A.id,
      section: "A",
      rollNumber: "10A004",
      admissionDate: new Date("2020-04-01"),
      grade: "B",
    },
  });

  console.log("✓ 6 students created\n");

  // ===== PARENTS =====
  console.log("👪 Creating parents...");

  const parent1 = await prisma.parent.create({
    data: {
      userId: parent1User.id,
      occupation: "Software Engineer",
    },
  });

  const parent2 = await prisma.parent.create({
    data: {
      userId: parent2User.id,
      occupation: "Doctor",
    },
  });

  const parent3 = await prisma.parent.create({
    data: {
      userId: parent3User.id,
      occupation: "Business Owner",
    },
  });

  console.log("✓ 3 parents created\n");

  // ===== PARENT STUDENT RELATIONSHIPS =====
  console.log("👨‍👩‍👧‍👦 Creating parent-student relationships...");

  await prisma.parentStudent.createMany({
    data: [
      { parentId: parent1.id, studentId: student1.id },
      { parentId: parent1.id, studentId: student2.id },
      { parentId: parent2.id, studentId: student3.id },
      { parentId: parent3.id, studentId: student4.id },
      { parentId: parent1.id, studentId: student5.id },
      { parentId: parent3.id, studentId: student6.id },
    ],
  });

  console.log("✓ 6 parent-student relationships created\n");

  // ===== CLASS SCHEDULES =====
  console.log("📅 Creating class schedules...");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const scheduleData = [];

  for (let day of days) {
    scheduleData.push(
      { classId: class10A.id, subjectId: math.id, teacherId: teacher1.id, day, startTime: "09:00", endTime: "10:00", roomNumber: "101" },
      { classId: class10A.id, subjectId: science.id, teacherId: teacher2.id, day, startTime: "10:15", endTime: "11:15", roomNumber: "102" },
      { classId: class10A.id, subjectId: english.id, teacherId: teacher3.id, day, startTime: "11:30", endTime: "12:30", roomNumber: "103" },
      { classId: class10B.id, subjectId: math.id, teacherId: teacher1.id, day, startTime: "13:00", endTime: "14:00", roomNumber: "201" },
      { classId: class10B.id, subjectId: science.id, teacherId: teacher2.id, day, startTime: "14:15", endTime: "15:15", roomNumber: "202" }
    );
  }

  await prisma.classSchedule.createMany({ data: scheduleData });

  console.log("✓ 25 class schedule entries created\n");

  // ===== FEE STRUCTURES =====
  console.log("💰 Creating fee structures...");

  const monthlyFee10A = await prisma.feeStructure.create({
    data: { classId: class10A.id, feeType: "MONTHLY", amount: 2500 },
  });

  const quarterlyFee10A = await prisma.feeStructure.create({
    data: { classId: class10A.id, feeType: "QUARTERLY", amount: 7500 },
  });

  const halfYearlyFee10A = await prisma.feeStructure.create({
    data: { classId: class10A.id, feeType: "HALF_YEARLY", amount: 15000 },
  });

  const monthlyFee10B = await prisma.feeStructure.create({
    data: { classId: class10B.id, feeType: "MONTHLY", amount: 2500 },
  });

  const quarterlyFee10B = await prisma.feeStructure.create({
    data: { classId: class10B.id, feeType: "QUARTERLY", amount: 7500 },
  });

  console.log("✓ 5 fee structures created\n");

  // ===== FEE PAYMENTS =====
  console.log("💳 Creating fee payments...");

  const feePayments = [];

  // Student 1 - fees
  feePayments.push(
    { studentId: student1.id, feeStructureId: monthlyFee10A.id, amountPaid: 2500, paymentDate: new Date("2026-03-05"), status: "PAID" as const, receiptUrl: "receipt_001.pdf" },
    { studentId: student1.id, feeStructureId: monthlyFee10A.id, amountPaid: 2500, paymentDate: new Date("2026-02-05"), status: "PAID" as const, receiptUrl: "receipt_002.pdf" },
    { studentId: student1.id, feeStructureId: quarterlyFee10A.id, amountPaid: 7500, paymentDate: new Date("2026-01-10"), status: "PAID" as const, receiptUrl: "receipt_003.pdf" }
  );

  // Student 2 - fees
  feePayments.push(
    { studentId: student2.id, feeStructureId: monthlyFee10A.id, amountPaid: 2500, paymentDate: new Date("2026-03-05"), status: "PAID" as const, receiptUrl: "receipt_004.pdf" },
    { studentId: student2.id, feeStructureId: monthlyFee10A.id, amountPaid: 1250, paymentDate: new Date("2026-02-10"), status: "PARTIAL" as const, receiptUrl: "receipt_005.pdf" }
  );

  // Student 3 - fees
  feePayments.push(
    { studentId: student3.id, feeStructureId: monthlyFee10B.id, amountPaid: 0, paymentDate: null, status: "UNPAID" as const, receiptUrl: null },
    { studentId: student3.id, feeStructureId: quarterlyFee10B.id, amountPaid: 7500, paymentDate: new Date("2026-01-15"), status: "PAID" as const, receiptUrl: "receipt_006.pdf" }
  );

  // Student 4 - fees
  feePayments.push(
    { studentId: student4.id, feeStructureId: monthlyFee10A.id, amountPaid: 2500, paymentDate: new Date("2026-03-01"), status: "PAID" as const, receiptUrl: "receipt_007.pdf" },
    { studentId: student4.id, feeStructureId: monthlyFee10A.id, amountPaid: 2500, paymentDate: new Date("2026-02-01"), status: "PAID" as const, receiptUrl: "receipt_008.pdf" }
  );

  // Student 5 - fees
  feePayments.push(
    { studentId: student5.id, feeStructureId: monthlyFee10B.id, amountPaid: 0, paymentDate: null, status: "UNPAID" as const, receiptUrl: null }
  );

  // Student 6 - fees
  feePayments.push(
    { studentId: student6.id, feeStructureId: monthlyFee10A.id, amountPaid: 2500, paymentDate: new Date("2026-03-10"), status: "PAID" as const, receiptUrl: "receipt_009.pdf" }
  );

  await prisma.feePayment.createMany({ data: feePayments });

  console.log("✓ 12 fee payments created\n");

  // ===== EXAMS =====
  console.log("📝 Creating exams...");

  const exam1 = await prisma.exam.create({
    data: {
      name: "Mid-term Math Exam",
      classId: class10A.id,
      subjectId: math.id,
      date: new Date("2026-03-15"),
      duration: "2 hours",
      totalMarks: 100,
      type: "MONTHLY",
      status: "COMPLETED",
    },
  });

  const exam2 = await prisma.exam.create({
    data: {
      name: "Science Quarterly Exam",
      classId: class10A.id,
      subjectId: science.id,
      date: new Date("2026-03-20"),
      duration: "2.5 hours",
      totalMarks: 100,
      type: "QUARTERLY",
      status: "COMPLETED",
    },
  });

  const exam3 = await prisma.exam.create({
    data: {
      name: "English Final Exam",
      classId: class10A.id,
      subjectId: english.id,
      date: new Date("2026-04-10"),
      duration: "3 hours",
      totalMarks: 100,
      type: "HALF_YEARLY",
      status: "UPCOMING",
    },
  });

  const exam4 = await prisma.exam.create({
    data: {
      name: "Math Exam - Class 10B",
      classId: class10B.id,
      subjectId: math.id,
      date: new Date("2026-03-16"),
      duration: "2 hours",
      totalMarks: 100,
      type: "MONTHLY",
      status: "COMPLETED",
    },
  });

  const exam5 = await prisma.exam.create({
    data: {
      name: "Science Exam - Class 10B",
      classId: class10B.id,
      subjectId: science.id,
      date: new Date("2026-03-21"),
      duration: "2.5 hours",
      totalMarks: 100,
      type: "MONTHLY",
      status: "COMPLETED",
    },
  });

  console.log("✓ 5 exams created\n");

  // ===== EXAM RESULTS =====
  console.log("📊 Creating exam results...");

  const examResults = [
    { examId: exam1.id, studentId: student1.id, marksObtained: 92, grade: "A+" },
    { examId: exam1.id, studentId: student2.id, marksObtained: 85, grade: "A" },
    { examId: exam1.id, studentId: student4.id, marksObtained: 78, grade: "B+" },
    { examId: exam1.id, studentId: student6.id, marksObtained: 72, grade: "B" },

    { examId: exam2.id, studentId: student1.id, marksObtained: 88, grade: "A" },
    { examId: exam2.id, studentId: student2.id, marksObtained: 82, grade: "A" },
    { examId: exam2.id, studentId: student4.id, marksObtained: 76, grade: "B+" },
    { examId: exam2.id, studentId: student6.id, marksObtained: 70, grade: "B" },

    { examId: exam4.id, studentId: student3.id, marksObtained: 90, grade: "A+" },
    { examId: exam4.id, studentId: student5.id, marksObtained: 88, grade: "A" },

    { examId: exam5.id, studentId: student3.id, marksObtained: 85, grade: "A" },
    { examId: exam5.id, studentId: student5.id, marksObtained: 92, grade: "A+" },
  ];

  await prisma.examResult.createMany({ data: examResults });

  console.log("✓ 12 exam results created\n");

  // ===== ATTENDANCE =====
  console.log("📋 Creating attendance records...");

  const attendanceData = [];
  const baseDate = new Date("2026-03-01");

  for (let i = 0; i < 20; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    attendanceData.push(
      { studentId: student1.id, classId: class10A.id, date, status: "PRESENT", markedBy: teacher1.id },
      { studentId: student2.id, classId: class10A.id, date, status: "PRESENT", markedBy: teacher1.id },
      { studentId: student4.id, classId: class10A.id, date, status: i % 5 === 0 ? "ABSENT" : "PRESENT", markedBy: teacher1.id },
      { studentId: student6.id, classId: class10A.id, date, status: i % 7 === 0 ? "LATE" : "PRESENT", markedBy: teacher1.id },
      { studentId: student3.id, classId: class10B.id, date, status: "PRESENT", markedBy: teacher2.id },
      { studentId: student5.id, classId: class10B.id, date, status: "PRESENT", markedBy: teacher2.id }
    );
  }

  await prisma.attendance.createMany({ data: attendanceData });

  console.log("✓ 60+ attendance records created\n");

  // ===== NOTICES =====
  console.log("📢 Creating notices...");

  const notice1 = await prisma.notice.create({
    data: {
      title: "Annual Sports Day",
      message: "The Annual Sports Day will be held on March 20, 2026. All students are expected to participate in at least one event.",
      category: "EVENT",
      priority: "high",
      pinned: true,
      createdBy: adminUser.id,
    },
  });

  const notice2 = await prisma.notice.create({
    data: {
      title: "Mid-Term Exam Schedule",
      message: "Mid-term examinations will begin from March 15, 2026. The complete schedule has been uploaded to the Exams section.",
      category: "EXAM",
      priority: "high",
      pinned: true,
      createdBy: adminUser.id,
    },
  });

  const notice3 = await prisma.notice.create({
    data: {
      title: "School Holiday - Republic Day",
      message: "The school will remain closed on January 26, 2026 (Republic Day). Classes will resume on January 27, 2026.",
      category: "HOLIDAY",
      priority: "normal",
      pinned: false,
      createdBy: adminUser.id,
    },
  });

  const notice4 = await prisma.notice.create({
    data: {
      title: "Parent-Teacher Meeting",
      message: "PTA meeting is scheduled for March 10, 2026 at 10:00 AM in the school auditorium. Parents from all classes are requested to attend.",
      category: "GENERAL",
      priority: "normal",
      pinned: true,
      createdBy: adminUser.id,
    },
  });

  const notice5 = await prisma.notice.create({
    data: {
      title: "Science Fair Registration",
      message: "Students interested in participating in the Science Fair should register by March 5, 2026. Submit your project proposal to the Science Department.",
      category: "EVENT",
      priority: "normal",
      pinned: false,
      createdBy: teacher2User.id,
    },
  });

  console.log("✓ 5 notices created\n");

  // ===== QUESTION PAPERS =====
  console.log("📄 Creating question papers...");

  await prisma.questionPaper.createMany({
    data: [
      { examId: exam1.id, teacherId: teacher1.id, fileUrl: "question_paper_001.pdf", status: "APPROVED" },
      { examId: exam2.id, teacherId: teacher2.id, fileUrl: "question_paper_002.pdf", status: "APPROVED" },
      { examId: exam3.id, teacherId: teacher3.id, fileUrl: "question_paper_003.pdf", status: "PENDING" },
      { examId: exam4.id, teacherId: teacher1.id, fileUrl: "question_paper_004.pdf", status: "APPROVED" },
      { examId: exam5.id, teacherId: teacher2.id, fileUrl: "question_paper_005.pdf", status: "APPROVED" },
    ],
  });

  console.log("✓ 5 question papers created\n");

  // ===== NOTIFICATIONS =====
  console.log("🔔 Creating notifications...");

  const notifications = [];

  for (let i = 0; i < 3; i++) {
    notifications.push(
      { userId: adminUser.id, title: "System Update", message: `System maintenance scheduled for ${new Date().toDateString()}`, type: "info", read: i > 1 },
      { userId: teacher1User.id, title: "New Exam Created", message: "Mid-term Math Exam has been created. Please review the details.", type: "info", read: i > 0 },
      { userId: parent1User.id, title: "Fee Payment Reminder", message: "Monthly tuition fee for March is due. Please make the payment by March 10.", type: "warning", read: false },
      { userId: student1User.id, title: "Exam Result Published", message: "Your Mid-term Math Exam results have been published. You scored 92/100.", type: "success", read: false }
    );
  }

  await prisma.notification.createMany({ data: notifications });

  console.log("✓ 12 notifications created\n");

  // ===== ACTIVITY LOGS =====
  console.log("📝 Creating activity logs...");

  const activityLogs = [
    { userId: adminUser.id, action: "USER_LOGIN", description: "Admin logged in from IP 192.168.1.1" },
    { userId: teacher1User.id, action: "EXAM_CREATED", description: "Created new exam: Mid-term Math Exam" },
    { userId: student1User.id, action: "EXAM_SUBMITTED", description: "Submitted Mid-term Math Exam" },
    { userId: parent1User.id, action: "PAYMENT_MADE", description: "Paid fee of 2500 for March" },
    { userId: adminUser.id, action: "NOTICE_PUBLISHED", description: "Published notice: Annual Sports Day" },
    { userId: teacher1User.id, action: "ATTENDANCE_MARKED", description: "Marked attendance for class 10A" },
    { userId: student2User.id, action: "RESULT_VIEWED", description: "Viewed exam results" },
    { userId: parent2User.id, action: "CHILD_PROGRESS_VIEWED", description: "Viewed child's progress report" },
    { userId: teacher2User.id, action: "GRADE_SUBMITTED", description: "Submitted grades for Science exam" },
    { userId: parent3User.id, action: "DOCUMENT_DOWNLOADED", description: "Downloaded attendance report" },
  ];

  await prisma.activityLog.createMany({ data: activityLogs });

  console.log("✓ 10 activity logs created\n");

  // ===== CHAT MESSAGES =====
  console.log("💬 Creating chat messages...");

  await prisma.chatMessage.createMany({
    data: [
      { senderId: teacher1User.id, receiverId: parent1User.id, message: "Hello, how can I help you regarding your child's progress?", read: true },
      { senderId: parent1User.id, receiverId: teacher1User.id, message: "Hi, I wanted to discuss Alice's performance in math.", read: true },
      { senderId: teacher1User.id, receiverId: parent1User.id, message: "Alice is doing great! She scored 92 in the recent exam.", read: true },
      { senderId: parent1User.id, receiverId: teacher1User.id, message: "Thank you for the update! That's wonderful to hear.", read: true },
      { senderId: adminUser.id, receiverId: teacher1User.id, message: "Please submit the question papers for the upcoming exams.", read: false },
      { senderId: teacher1User.id, receiverId: adminUser.id, message: "Sure, I'll submit them by tomorrow.", read: true },
      { senderId: teacher2User.id, receiverId: parent2User.id, message: "Your child Carol has excellent participation in class.", read: true },
      { senderId: parent2User.id, receiverId: teacher2User.id, message: "Thank you for the feedback. We encourage her to do her best.", read: true },
    ],
  });

  console.log("✓ 8 chat messages created\n");

  console.log("\n" + "=".repeat(60));
  console.log("✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("=".repeat(60));

  console.log("\n📊 SEEDING SUMMARY:");
  console.log("   • 1 Admin user");
  console.log("   • 3 Teachers (Mathematics, Science, English)");
  console.log("   • 3 Parents");
  console.log("   • 6 Students");
  console.log("   • 2 Classes (10A, 10B)");
  console.log("   • 5 Subjects");
  console.log("   • 5 Exams");
  console.log("   • 12 Exam Results");
  console.log("   • 60+ Attendance Records");
  console.log("   • 12 Fee Payments");
  console.log("   • 5 Notices");
  console.log("   • 5 Question Papers");
  console.log("   • 12 Notifications");
  console.log("   • 10 Activity Logs");
  console.log("   • 8 Chat Messages");

  console.log("\n📋 TEST CREDENTIALS:");
  console.log("=".repeat(60));
  console.log("\n🔐 ADMIN");
  console.log("   Email: admin@edupro.com");
  console.log("   Password: password123");
  console.log("\n🔐 TEACHER (Sarah Johnson)");
  console.log("   Email: sarah@edupro.com");
  console.log("   Password: password123");
  console.log("\n🔐 STUDENT (Alice Johnson)");
  console.log("   Email: alice.johnson@edupro.com");
  console.log("   Password: password123");
  console.log("\n🔐 PARENT (Michael Davis)");
  console.log("   Email: parent@edupro.com");
  console.log("   Password: password123");
  console.log("\n" + "=".repeat(60));
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
