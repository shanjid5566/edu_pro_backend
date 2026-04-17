import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
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
  const now = new Date();
  const DAY_MS = 24 * 60 * 60 * 1000;
  const daysFromNow = (days: number) => new Date(now.getTime() + days * DAY_MS);
  const yearsAgo = (years: number) =>
    new Date(now.getFullYear() - years, now.getMonth(), now.getDate());
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const gradeFromPercentage = (percentage: number) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    return "C";
  };

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
      joinDate: yearsAgo(6),
      classesTaken: 2,
    },
  });

  const teacher2 = await prisma.teacher.create({
    data: {
      userId: teacher2User.id,
      department: "Science",
      joinDate: yearsAgo(7),
      classesTaken: 3,
    },
  });

  const teacher3 = await prisma.teacher.create({
    data: {
      userId: teacher3User.id,
      department: "English",
      joinDate: yearsAgo(5),
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
      admissionDate: yearsAgo(5),
      grade: "A+",
    },
  });

  const student2 = await prisma.student.create({
    data: {
      userId: student2User.id,
      classId: class10A.id,
      section: "A",
      rollNumber: "10A002",
      admissionDate: yearsAgo(5),
      grade: "A",
    },
  });

  const student3 = await prisma.student.create({
    data: {
      userId: student3User.id,
      classId: class10B.id,
      section: "B",
      rollNumber: "10B001",
      admissionDate: yearsAgo(5),
      grade: "A",
    },
  });

  const student4 = await prisma.student.create({
    data: {
      userId: student4User.id,
      classId: class10A.id,
      section: "A",
      rollNumber: "10A003",
      admissionDate: yearsAgo(5),
      grade: "B+",
    },
  });

  const student5 = await prisma.student.create({
    data: {
      userId: student5User.id,
      classId: class10B.id,
      section: "B",
      rollNumber: "10B002",
      admissionDate: yearsAgo(5),
      grade: "A+",
    },
  });

  const student6 = await prisma.student.create({
    data: {
      userId: student6User.id,
      classId: class10A.id,
      section: "A",
      rollNumber: "10A004",
      admissionDate: yearsAgo(5),
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
  const studentsWithFeeStructure = [
    { studentId: student1.id, feeStructureId: monthlyFee10A.id, amount: 2500 },
    { studentId: student2.id, feeStructureId: monthlyFee10A.id, amount: 2500 },
    { studentId: student3.id, feeStructureId: monthlyFee10B.id, amount: 2500 },
    { studentId: student4.id, feeStructureId: monthlyFee10A.id, amount: 2500 },
    { studentId: student5.id, feeStructureId: monthlyFee10B.id, amount: 2500 },
    { studentId: student6.id, feeStructureId: monthlyFee10A.id, amount: 2500 },
  ];

  for (let monthOffset = 0; monthOffset < 8; monthOffset++) {
    const dueDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 5);

    studentsWithFeeStructure.forEach((studentFee, index) => {
      const paymentPattern = (index + monthOffset) % 6;
      const isUnpaid = paymentPattern === 0;
      const isPartial = paymentPattern === 1;

      feePayments.push({
        studentId: studentFee.studentId,
        feeStructureId: studentFee.feeStructureId,
        amountPaid: isUnpaid ? 0 : isPartial ? studentFee.amount / 2 : studentFee.amount,
        paymentDate: isUnpaid ? null : new Date(dueDate.getFullYear(), dueDate.getMonth(), 5 + ((index % 4) + 1)),
        status: isUnpaid ? ("UNPAID" as const) : isPartial ? ("PARTIAL" as const) : ("PAID" as const),
        receiptUrl: isUnpaid
          ? null
          : `receipt_${studentFee.studentId.slice(0, 4)}_${dueDate.getFullYear()}_${String(dueDate.getMonth() + 1).padStart(2, "0")}.pdf`,
      });
    });
  }

  // Add a few quarterly and half-yearly payments to make data more realistic.
  feePayments.push(
    {
      studentId: student1.id,
      feeStructureId: quarterlyFee10A.id,
      amountPaid: 7500,
      paymentDate: daysFromNow(-70),
      status: "PAID" as const,
      receiptUrl: "receipt_quarterly_10A_s1.pdf",
    },
    {
      studentId: student2.id,
      feeStructureId: quarterlyFee10A.id,
      amountPaid: 3750,
      paymentDate: daysFromNow(-35),
      status: "PARTIAL" as const,
      receiptUrl: "receipt_quarterly_10A_s2.pdf",
    },
    {
      studentId: student4.id,
      feeStructureId: halfYearlyFee10A.id,
      amountPaid: 15000,
      paymentDate: daysFromNow(-120),
      status: "PAID" as const,
      receiptUrl: "receipt_halfyearly_10A_s4.pdf",
    },
    {
      studentId: student3.id,
      feeStructureId: quarterlyFee10B.id,
      amountPaid: 7500,
      paymentDate: daysFromNow(-95),
      status: "PAID" as const,
      receiptUrl: "receipt_quarterly_10B_s3.pdf",
    }
  );

  await prisma.feePayment.createMany({ data: feePayments });

  console.log(`✓ ${feePayments.length} fee payments created\n`);

  // ===== EXAMS =====
  console.log("📝 Creating exams...");

  const examBlueprints = [
    { name: "Mathematics Unit Test - 10A", classId: class10A.id, subjectId: math.id, dateOffset: -95, duration: "90 minutes", totalMarks: 50, type: "MONTHLY", status: "COMPLETED" },
    { name: "Science Unit Test - 10A", classId: class10A.id, subjectId: science.id, dateOffset: -82, duration: "90 minutes", totalMarks: 50, type: "MONTHLY", status: "COMPLETED" },
    { name: "English Assessment - 10A", classId: class10A.id, subjectId: english.id, dateOffset: -68, duration: "2 hours", totalMarks: 100, type: "MONTHLY", status: "COMPLETED" },
    { name: "Mathematics Unit Test - 10B", classId: class10B.id, subjectId: math.id, dateOffset: -91, duration: "90 minutes", totalMarks: 50, type: "MONTHLY", status: "COMPLETED" },
    { name: "Science Assessment - 10B", classId: class10B.id, subjectId: science.id, dateOffset: -74, duration: "2 hours", totalMarks: 100, type: "MONTHLY", status: "COMPLETED" },
    { name: "Quarterly Mathematics Exam - 10A", classId: class10A.id, subjectId: math.id, dateOffset: -40, duration: "2.5 hours", totalMarks: 100, type: "QUARTERLY", status: "COMPLETED" },
    { name: "Quarterly Science Exam - 10B", classId: class10B.id, subjectId: science.id, dateOffset: -33, duration: "2.5 hours", totalMarks: 100, type: "QUARTERLY", status: "COMPLETED" },
    { name: "Half-Yearly English Exam - 10A", classId: class10A.id, subjectId: english.id, dateOffset: 12, duration: "3 hours", totalMarks: 100, type: "HALF_YEARLY", status: "UPCOMING" },
    { name: "Half-Yearly Mathematics Exam - 10B", classId: class10B.id, subjectId: math.id, dateOffset: 16, duration: "3 hours", totalMarks: 100, type: "HALF_YEARLY", status: "UPCOMING" },
    { name: "Geography Enrichment Test - 10A", classId: class10A.id, subjectId: geography.id, dateOffset: 24, duration: "2 hours", totalMarks: 80, type: "MONTHLY", status: "UPCOMING" },
  ] as const;

  const createdExams = [];
  for (const blueprint of examBlueprints) {
    const exam = await prisma.exam.create({
      data: {
        name: blueprint.name,
        classId: blueprint.classId,
        subjectId: blueprint.subjectId,
        date: daysFromNow(blueprint.dateOffset),
        duration: blueprint.duration,
        totalMarks: blueprint.totalMarks,
        type: blueprint.type,
        status: blueprint.status,
      },
    });

    createdExams.push(exam);
  }

  console.log(`✓ ${createdExams.length} exams created\n`);

  // ===== EXAM RESULTS =====
  console.log("📊 Creating exam results...");

  const examResults = [];
  const studentsByClass: Record<string, string[]> = {
    [class10A.id]: [student1.id, student2.id, student4.id, student6.id],
    [class10B.id]: [student3.id, student5.id],
  };

  createdExams.forEach((exam, examIndex) => {
    if (exam.status !== "COMPLETED") return;

    const classStudents = studentsByClass[exam.classId] || [];
    classStudents.forEach((studentId, studentIndex) => {
      const percentage = 58 + ((examIndex + 2) * 11 + (studentIndex + 3) * 7) % 40;
      const marksObtained = Math.round((percentage / 100) * exam.totalMarks);

      examResults.push({
        examId: exam.id,
        studentId,
        marksObtained,
        grade: gradeFromPercentage(percentage),
      });
    });
  });

  await prisma.examResult.createMany({ data: examResults });

  console.log(`✓ ${examResults.length} exam results created\n`);

  // ===== ATTENDANCE =====
  console.log("📋 Creating attendance records...");

  const attendanceData = [];
  const attendanceWindowDays = 90;

  for (let i = attendanceWindowDays; i >= 1; i--) {
    const date = daysFromNow(-i);

    // Skip weekends for realistic school attendance.
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const class10AStudents = [student1.id, student2.id, student4.id, student6.id];
    const class10BStudents = [student3.id, student5.id];

    class10AStudents.forEach((studentId, studentIndex) => {
      const signal = (i + 3) * (studentIndex + 5);
      const status = signal % 19 === 0 ? "ABSENT" : signal % 11 === 0 ? "LATE" : "PRESENT";
      attendanceData.push({ studentId, classId: class10A.id, date, status, markedBy: teacher1.id });
    });

    class10BStudents.forEach((studentId, studentIndex) => {
      const signal = (i + 7) * (studentIndex + 4);
      const status = signal % 17 === 0 ? "ABSENT" : signal % 13 === 0 ? "LATE" : "PRESENT";
      attendanceData.push({ studentId, classId: class10B.id, date, status, markedBy: teacher2.id });
    });
  }

  await prisma.attendance.createMany({ data: attendanceData });

  console.log(`✓ ${attendanceData.length} attendance records created\n`);

  // ===== NOTICES =====
  console.log("📢 Creating notices...");

  const notices = [
    {
      title: "Annual Sports Day",
      message: `Annual Sports Day is scheduled on ${formatDate(daysFromNow(14))}. Students should register for at least one event by ${formatDate(daysFromNow(7))}.`,
      category: "EVENT",
      priority: "high",
      pinned: true,
      createdBy: adminUser.id,
    },
    {
      title: "Quarterly Exam Timetable",
      message: `Quarterly exams begin on ${formatDate(daysFromNow(10))}. Detailed timetable is available in the Exams section.`,
      category: "EXAM",
      priority: "high",
      pinned: true,
      createdBy: adminUser.id,
    },
    {
      title: "Parent-Teacher Meeting",
      message: `PTA meeting will be held on ${formatDate(daysFromNow(5))} at 10:30 AM in the auditorium.`,
      category: "GENERAL",
      priority: "normal",
      pinned: true,
      createdBy: adminUser.id,
    },
    {
      title: "Science Fair Registration",
      message: `Science Fair registration closes on ${formatDate(daysFromNow(9))}. Submit abstracts to the Science Department.`,
      category: "EVENT",
      priority: "normal",
      pinned: false,
      createdBy: teacher2User.id,
    },
    {
      title: "Library Week",
      message: `Library Week starts ${formatDate(daysFromNow(3))}. Students can issue up to 3 books during this week.`,
      category: "GENERAL",
      priority: "normal",
      pinned: false,
      createdBy: teacher3User.id,
    },
    {
      title: "Health Checkup Camp",
      message: `Annual health checkup camp will run from ${formatDate(daysFromNow(18))} to ${formatDate(daysFromNow(20))}.`,
      category: "EVENT",
      priority: "normal",
      pinned: false,
      createdBy: adminUser.id,
    },
    {
      title: "Holiday Announcement",
      message: `School will remain closed on ${formatDate(daysFromNow(26))} for a public holiday.`,
      category: "HOLIDAY",
      priority: "normal",
      pinned: false,
      createdBy: adminUser.id,
    },
    {
      title: "Math Remedial Classes",
      message: `Remedial classes for Mathematics begin on ${formatDate(daysFromNow(6))} at 4:00 PM.`,
      category: "GENERAL",
      priority: "normal",
      pinned: false,
      createdBy: teacher1User.id,
    },
    {
      title: "Fee Reminder",
      message: `Monthly fee due date is ${formatDate(daysFromNow(4))}. Please avoid late charges by paying on time.`,
      category: "GENERAL",
      priority: "high",
      pinned: true,
      createdBy: adminUser.id,
    },
    {
      title: "English Debate Trials",
      message: `Debate team trials are scheduled for ${formatDate(daysFromNow(11))}. Interested students can register with the English Department.`,
      category: "EVENT",
      priority: "normal",
      pinned: false,
      createdBy: teacher3User.id,
    },
  ];

  await prisma.notice.createMany({ data: notices });

  console.log(`✓ ${notices.length} notices created\n`);

  // ===== QUESTION PAPERS =====
  console.log("📄 Creating question papers...");

  const teacherBySubject: Record<string, string> = {
    [math.id]: teacher1.id,
    [science.id]: teacher2.id,
    [english.id]: teacher3.id,
    [history.id]: teacher3.id,
    [geography.id]: teacher2.id,
  };

  const questionPapers = createdExams.map((exam, index) => ({
    examId: exam.id,
    teacherId: teacherBySubject[exam.subjectId] || teacher1.id,
    fileUrl: `question_paper_${String(index + 1).padStart(3, "0")}.pdf`,
    status: exam.status === "COMPLETED" ? "APPROVED" : "PENDING",
  }));

  await prisma.questionPaper.createMany({ data: questionPapers });

  console.log(`✓ ${questionPapers.length} question papers created\n`);

  // ===== NOTIFICATIONS =====
  console.log("🔔 Creating notifications...");

  const notifications = [];
  const users = [
    adminUser,
    teacher1User,
    teacher2User,
    teacher3User,
    parent1User,
    parent2User,
    parent3User,
    student1User,
    student2User,
    student3User,
    student4User,
    student5User,
    student6User,
  ];

  const notificationTemplates = [
    { title: "System Update", message: `Portal update scheduled on ${formatDate(daysFromNow(2))}.`, type: "info" },
    { title: "Attendance Summary", message: "Weekly attendance summary is now available.", type: "info" },
    { title: "Fee Reminder", message: `Fee due date is ${formatDate(daysFromNow(4))}.`, type: "warning" },
    { title: "Exam Alert", message: `Upcoming exam begins from ${formatDate(daysFromNow(10))}.`, type: "warning" },
    { title: "Result Published", message: "Recent assessment results have been published.", type: "success" },
    { title: "Notice Board", message: "A new notice has been posted on the dashboard.", type: "info" },
  ];

  users.forEach((user, userIndex) => {
    notificationTemplates.forEach((template, templateIndex) => {
      notifications.push({
        userId: user.id,
        title: template.title,
        message: template.message,
        type: template.type,
        read: (userIndex + templateIndex) % 4 === 0,
      });
    });
  });

  await prisma.notification.createMany({ data: notifications });

  console.log(`✓ ${notifications.length} notifications created\n`);

  // ===== ACTIVITY LOGS =====
  console.log("📝 Creating activity logs...");

  const activityLogs = [];
  const activityActions = [
    { action: "USER_LOGIN", description: "Logged in to dashboard" },
    { action: "NOTICE_VIEWED", description: "Viewed latest school notices" },
    { action: "ATTENDANCE_CHECKED", description: "Checked attendance analytics" },
    { action: "EXAM_INTERACTION", description: "Accessed exam module" },
    { action: "PAYMENT_ACTIVITY", description: "Visited fee and payment section" },
    { action: "PROFILE_UPDATED", description: "Updated profile preferences" },
  ];

  users.forEach((user, userIndex) => {
    for (let i = 0; i < 6; i++) {
      const actionMeta = activityActions[(userIndex + i) % activityActions.length];
      activityLogs.push({
        userId: user.id,
        action: actionMeta.action,
        description: `${actionMeta.description} (${formatDate(daysFromNow(-(userIndex + i + 1)))})`,
      });
    }
  });

  await prisma.activityLog.createMany({ data: activityLogs });

  console.log(`✓ ${activityLogs.length} activity logs created\n`);

  // ===== CHAT MESSAGES =====
  console.log("💬 Creating chat messages...");

  const chatMessages = [];
  const conversationPairs = [
    { a: teacher1User.id, b: parent1User.id, topics: ["Alice's recent progress", "Math practice plan", "Next PTM schedule"] },
    { a: teacher2User.id, b: parent2User.id, topics: ["Science project update", "Lab participation", "Homework completion"] },
    { a: teacher3User.id, b: parent3User.id, topics: ["Essay writing improvement", "Debate club tryouts", "Reading recommendations"] },
    { a: adminUser.id, b: teacher1User.id, topics: ["Question paper submission", "Exam invigilation roster", "Monthly report review"] },
    { a: student1User.id, b: student2User.id, topics: ["Study timetable", "Group assignment", "Sports day prep"] },
    { a: student3User.id, b: student5User.id, topics: ["Science fair idea", "Class notes exchange", "Exam revision"] },
  ];

  conversationPairs.forEach((pair, pairIndex) => {
    pair.topics.forEach((topic, topicIndex) => {
      chatMessages.push(
        {
          senderId: pair.a,
          receiverId: pair.b,
          message: `Hi, can we discuss ${topic.toLowerCase()}?`,
          read: true,
        },
        {
          senderId: pair.b,
          receiverId: pair.a,
          message: `Sure, let's connect on ${topic.toLowerCase()} this afternoon.`,
          read: (pairIndex + topicIndex) % 3 !== 0,
        }
      );
    });
  });

  await prisma.chatMessage.createMany({ data: chatMessages });

  console.log(`✓ ${chatMessages.length} chat messages created\n`);

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
  console.log(`   • ${createdExams.length} Exams`);
  console.log(`   • ${examResults.length} Exam Results`);
  console.log(`   • ${attendanceData.length} Attendance Records`);
  console.log(`   • ${feePayments.length} Fee Payments`);
  console.log(`   • ${notices.length} Notices`);
  console.log(`   • ${questionPapers.length} Question Papers`);
  console.log(`   • ${notifications.length} Notifications`);
  console.log(`   • ${activityLogs.length} Activity Logs`);
  console.log(`   • ${chatMessages.length} Chat Messages`);

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
