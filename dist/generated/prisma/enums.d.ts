export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly TEACHER: "TEACHER";
    readonly STUDENT: "STUDENT";
    readonly PARENT: "PARENT";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const Gender: {
    readonly MALE: "MALE";
    readonly FEMALE: "FEMALE";
    readonly OTHER: "OTHER";
};
export type Gender = (typeof Gender)[keyof typeof Gender];
export declare const AttendanceStatus: {
    readonly PRESENT: "PRESENT";
    readonly ABSENT: "ABSENT";
    readonly LATE: "LATE";
};
export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];
export declare const ExamStatus: {
    readonly UPCOMING: "UPCOMING";
    readonly ONGOING: "ONGOING";
    readonly COMPLETED: "COMPLETED";
};
export type ExamStatus = (typeof ExamStatus)[keyof typeof ExamStatus];
export declare const ExamType: {
    readonly MONTHLY: "MONTHLY";
    readonly QUARTERLY: "QUARTERLY";
    readonly HALF_YEARLY: "HALF_YEARLY";
    readonly YEARLY: "YEARLY";
};
export type ExamType = (typeof ExamType)[keyof typeof ExamType];
export declare const PaperStatus: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type PaperStatus = (typeof PaperStatus)[keyof typeof PaperStatus];
export declare const FeeType: {
    readonly MONTHLY: "MONTHLY";
    readonly QUARTERLY: "QUARTERLY";
    readonly HALF_YEARLY: "HALF_YEARLY";
    readonly YEARLY: "YEARLY";
};
export type FeeType = (typeof FeeType)[keyof typeof FeeType];
export declare const PaymentStatus: {
    readonly PAID: "PAID";
    readonly UNPAID: "UNPAID";
    readonly PARTIAL: "PARTIAL";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
//# sourceMappingURL=enums.d.ts.map