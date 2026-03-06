import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    /**
   * ## Prisma Client
   *
   * Type-safe database client for TypeScript
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined, in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Executes a prepared raw query and returns the number of affected rows.
       * @example
       * ```
       * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
       * ```
       *
       * Read more in our [docs](https://pris.ly/d/raw-queries).
       */
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Executes a raw query and returns the number of affected rows.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Performs a raw query and returns the `SELECT` data.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
     * @example
     * ```
     * const [george, bob, alice] = await prisma.$transaction([
     *   prisma.user.create({ data: { name: 'George' } }),
     *   prisma.user.create({ data: { name: 'Bob' } }),
     *   prisma.user.create({ data: { name: 'Alice' } }),
     * ])
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
     */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.user`: Exposes CRUD operations for the **User** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Users
  * const users = await prisma.user.findMany()
  * ```
  */
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Profiles
      * const profiles = await prisma.profile.findMany()
      * ```
      */
    get profile(): Prisma.ProfileDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.student`: Exposes CRUD operations for the **Student** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Students
      * const students = await prisma.student.findMany()
      * ```
      */
    get student(): Prisma.StudentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.teacher`: Exposes CRUD operations for the **Teacher** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Teachers
      * const teachers = await prisma.teacher.findMany()
      * ```
      */
    get teacher(): Prisma.TeacherDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.parent`: Exposes CRUD operations for the **Parent** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Parents
      * const parents = await prisma.parent.findMany()
      * ```
      */
    get parent(): Prisma.ParentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.parentStudent`: Exposes CRUD operations for the **ParentStudent** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ParentStudents
      * const parentStudents = await prisma.parentStudent.findMany()
      * ```
      */
    get parentStudent(): Prisma.ParentStudentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.class`: Exposes CRUD operations for the **Class** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Classes
      * const classes = await prisma.class.findMany()
      * ```
      */
    get class(): Prisma.ClassDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.subject`: Exposes CRUD operations for the **Subject** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Subjects
      * const subjects = await prisma.subject.findMany()
      * ```
      */
    get subject(): Prisma.SubjectDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.classSubject`: Exposes CRUD operations for the **ClassSubject** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClassSubjects
      * const classSubjects = await prisma.classSubject.findMany()
      * ```
      */
    get classSubject(): Prisma.ClassSubjectDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.teacherSubject`: Exposes CRUD operations for the **TeacherSubject** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TeacherSubjects
      * const teacherSubjects = await prisma.teacherSubject.findMany()
      * ```
      */
    get teacherSubject(): Prisma.TeacherSubjectDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.teacherClass`: Exposes CRUD operations for the **TeacherClass** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TeacherClasses
      * const teacherClasses = await prisma.teacherClass.findMany()
      * ```
      */
    get teacherClass(): Prisma.TeacherClassDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.attendance`: Exposes CRUD operations for the **Attendance** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Attendances
      * const attendances = await prisma.attendance.findMany()
      * ```
      */
    get attendance(): Prisma.AttendanceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.exam`: Exposes CRUD operations for the **Exam** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Exams
      * const exams = await prisma.exam.findMany()
      * ```
      */
    get exam(): Prisma.ExamDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.examResult`: Exposes CRUD operations for the **ExamResult** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ExamResults
      * const examResults = await prisma.examResult.findMany()
      * ```
      */
    get examResult(): Prisma.ExamResultDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.questionPaper`: Exposes CRUD operations for the **QuestionPaper** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more QuestionPapers
      * const questionPapers = await prisma.questionPaper.findMany()
      * ```
      */
    get questionPaper(): Prisma.QuestionPaperDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.feeStructure`: Exposes CRUD operations for the **FeeStructure** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more FeeStructures
      * const feeStructures = await prisma.feeStructure.findMany()
      * ```
      */
    get feeStructure(): Prisma.FeeStructureDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.feePayment`: Exposes CRUD operations for the **FeePayment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more FeePayments
      * const feePayments = await prisma.feePayment.findMany()
      * ```
      */
    get feePayment(): Prisma.FeePaymentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ChatMessages
      * const chatMessages = await prisma.chatMessage.findMany()
      * ```
      */
    get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.notice`: Exposes CRUD operations for the **Notice** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Notices
      * const notices = await prisma.notice.findMany()
      * ```
      */
    get notice(): Prisma.NoticeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Notifications
      * const notifications = await prisma.notification.findMany()
      * ```
      */
    get notification(): Prisma.NotificationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.activityLog`: Exposes CRUD operations for the **ActivityLog** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ActivityLogs
      * const activityLogs = await prisma.activityLog.findMany()
      * ```
      */
    get activityLog(): Prisma.ActivityLogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.setting`: Exposes CRUD operations for the **Setting** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Settings
      * const settings = await prisma.setting.findMany()
      * ```
      */
    get setting(): Prisma.SettingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map