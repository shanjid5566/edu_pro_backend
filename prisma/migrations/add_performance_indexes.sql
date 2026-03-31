-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_name_idx" ON "User"("name");
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex for Student
CREATE INDEX "Student_rollNumber_idx" ON "Student"("rollNumber");
CREATE INDEX "Student_classId_idx" ON "Student"("classId");
CREATE INDEX "Student_userId_idx" ON "Student"("userId");

-- CreateIndex for Attendance
CREATE INDEX "Attendance_classId_idx" ON "Attendance"("classId");
CREATE INDEX "Attendance_studentId_idx" ON "Attendance"("studentId");
CREATE INDEX "Attendance_date_idx" ON "Attendance"("date");
CREATE INDEX "Attendance_status_idx" ON "Attendance"("status");
CREATE INDEX "Attendance_classId_date_idx" ON "Attendance"("classId", "date");

-- CreateIndex for Notice
CREATE INDEX "Notice_category_idx" ON "Notice"("category");
CREATE INDEX "Notice_pinned_idx" ON "Notice"("pinned");
CREATE INDEX "Notice_createdAt_idx" ON "Notice"("createdAt");

-- CreateIndex for Exam
CREATE INDEX "Exam_classId_idx" ON "Exam"("classId");
CREATE INDEX "Exam_status_idx" ON "Exam"("status");
CREATE INDEX "Exam_date_idx" ON "Exam"("date");

-- CreateIndex for Teacher
CREATE INDEX "Teacher_userId_idx" ON "Teacher"("userId");
CREATE INDEX "Teacher_department_idx" ON "Teacher"("department");

-- CreateIndex for Parent
CREATE INDEX "Parent_userId_idx" ON "Parent"("userId");
CREATE INDEX "Parent_occupation_idx" ON "Parent"("occupation");

-- CreateIndex for Class
CREATE INDEX "Class_name_idx" ON "Class"("name");

-- CreateIndex for Subject
CREATE INDEX "Subject_name_idx" ON "Subject"("name");
