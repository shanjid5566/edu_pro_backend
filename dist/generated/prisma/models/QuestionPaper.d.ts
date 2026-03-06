import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model QuestionPaper
 *
 */
export type QuestionPaperModel = runtime.Types.Result.DefaultSelection<Prisma.$QuestionPaperPayload>;
export type AggregateQuestionPaper = {
    _count: QuestionPaperCountAggregateOutputType | null;
    _min: QuestionPaperMinAggregateOutputType | null;
    _max: QuestionPaperMaxAggregateOutputType | null;
};
export type QuestionPaperMinAggregateOutputType = {
    id: string | null;
    examId: string | null;
    teacherId: string | null;
    fileUrl: string | null;
    status: $Enums.PaperStatus | null;
    createdAt: Date | null;
};
export type QuestionPaperMaxAggregateOutputType = {
    id: string | null;
    examId: string | null;
    teacherId: string | null;
    fileUrl: string | null;
    status: $Enums.PaperStatus | null;
    createdAt: Date | null;
};
export type QuestionPaperCountAggregateOutputType = {
    id: number;
    examId: number;
    teacherId: number;
    fileUrl: number;
    status: number;
    createdAt: number;
    _all: number;
};
export type QuestionPaperMinAggregateInputType = {
    id?: true;
    examId?: true;
    teacherId?: true;
    fileUrl?: true;
    status?: true;
    createdAt?: true;
};
export type QuestionPaperMaxAggregateInputType = {
    id?: true;
    examId?: true;
    teacherId?: true;
    fileUrl?: true;
    status?: true;
    createdAt?: true;
};
export type QuestionPaperCountAggregateInputType = {
    id?: true;
    examId?: true;
    teacherId?: true;
    fileUrl?: true;
    status?: true;
    createdAt?: true;
    _all?: true;
};
export type QuestionPaperAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which QuestionPaper to aggregate.
     */
    where?: Prisma.QuestionPaperWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of QuestionPapers to fetch.
     */
    orderBy?: Prisma.QuestionPaperOrderByWithRelationInput | Prisma.QuestionPaperOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.QuestionPaperWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` QuestionPapers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` QuestionPapers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned QuestionPapers
    **/
    _count?: true | QuestionPaperCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: QuestionPaperMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: QuestionPaperMaxAggregateInputType;
};
export type GetQuestionPaperAggregateType<T extends QuestionPaperAggregateArgs> = {
    [P in keyof T & keyof AggregateQuestionPaper]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateQuestionPaper[P]> : Prisma.GetScalarType<T[P], AggregateQuestionPaper[P]>;
};
export type QuestionPaperGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionPaperWhereInput;
    orderBy?: Prisma.QuestionPaperOrderByWithAggregationInput | Prisma.QuestionPaperOrderByWithAggregationInput[];
    by: Prisma.QuestionPaperScalarFieldEnum[] | Prisma.QuestionPaperScalarFieldEnum;
    having?: Prisma.QuestionPaperScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: QuestionPaperCountAggregateInputType | true;
    _min?: QuestionPaperMinAggregateInputType;
    _max?: QuestionPaperMaxAggregateInputType;
};
export type QuestionPaperGroupByOutputType = {
    id: string;
    examId: string;
    teacherId: string;
    fileUrl: string;
    status: $Enums.PaperStatus;
    createdAt: Date;
    _count: QuestionPaperCountAggregateOutputType | null;
    _min: QuestionPaperMinAggregateOutputType | null;
    _max: QuestionPaperMaxAggregateOutputType | null;
};
type GetQuestionPaperGroupByPayload<T extends QuestionPaperGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<QuestionPaperGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof QuestionPaperGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], QuestionPaperGroupByOutputType[P]> : Prisma.GetScalarType<T[P], QuestionPaperGroupByOutputType[P]>;
}>>;
export type QuestionPaperWhereInput = {
    AND?: Prisma.QuestionPaperWhereInput | Prisma.QuestionPaperWhereInput[];
    OR?: Prisma.QuestionPaperWhereInput[];
    NOT?: Prisma.QuestionPaperWhereInput | Prisma.QuestionPaperWhereInput[];
    id?: Prisma.StringFilter<"QuestionPaper"> | string;
    examId?: Prisma.StringFilter<"QuestionPaper"> | string;
    teacherId?: Prisma.StringFilter<"QuestionPaper"> | string;
    fileUrl?: Prisma.StringFilter<"QuestionPaper"> | string;
    status?: Prisma.EnumPaperStatusFilter<"QuestionPaper"> | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeFilter<"QuestionPaper"> | Date | string;
    exam?: Prisma.XOR<Prisma.ExamScalarRelationFilter, Prisma.ExamWhereInput>;
    teacher?: Prisma.XOR<Prisma.TeacherScalarRelationFilter, Prisma.TeacherWhereInput>;
};
export type QuestionPaperOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    examId?: Prisma.SortOrder;
    teacherId?: Prisma.SortOrder;
    fileUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    exam?: Prisma.ExamOrderByWithRelationInput;
    teacher?: Prisma.TeacherOrderByWithRelationInput;
};
export type QuestionPaperWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.QuestionPaperWhereInput | Prisma.QuestionPaperWhereInput[];
    OR?: Prisma.QuestionPaperWhereInput[];
    NOT?: Prisma.QuestionPaperWhereInput | Prisma.QuestionPaperWhereInput[];
    examId?: Prisma.StringFilter<"QuestionPaper"> | string;
    teacherId?: Prisma.StringFilter<"QuestionPaper"> | string;
    fileUrl?: Prisma.StringFilter<"QuestionPaper"> | string;
    status?: Prisma.EnumPaperStatusFilter<"QuestionPaper"> | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeFilter<"QuestionPaper"> | Date | string;
    exam?: Prisma.XOR<Prisma.ExamScalarRelationFilter, Prisma.ExamWhereInput>;
    teacher?: Prisma.XOR<Prisma.TeacherScalarRelationFilter, Prisma.TeacherWhereInput>;
}, "id">;
export type QuestionPaperOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    examId?: Prisma.SortOrder;
    teacherId?: Prisma.SortOrder;
    fileUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.QuestionPaperCountOrderByAggregateInput;
    _max?: Prisma.QuestionPaperMaxOrderByAggregateInput;
    _min?: Prisma.QuestionPaperMinOrderByAggregateInput;
};
export type QuestionPaperScalarWhereWithAggregatesInput = {
    AND?: Prisma.QuestionPaperScalarWhereWithAggregatesInput | Prisma.QuestionPaperScalarWhereWithAggregatesInput[];
    OR?: Prisma.QuestionPaperScalarWhereWithAggregatesInput[];
    NOT?: Prisma.QuestionPaperScalarWhereWithAggregatesInput | Prisma.QuestionPaperScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"QuestionPaper"> | string;
    examId?: Prisma.StringWithAggregatesFilter<"QuestionPaper"> | string;
    teacherId?: Prisma.StringWithAggregatesFilter<"QuestionPaper"> | string;
    fileUrl?: Prisma.StringWithAggregatesFilter<"QuestionPaper"> | string;
    status?: Prisma.EnumPaperStatusWithAggregatesFilter<"QuestionPaper"> | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"QuestionPaper"> | Date | string;
};
export type QuestionPaperCreateInput = {
    id?: string;
    fileUrl: string;
    status?: $Enums.PaperStatus;
    createdAt?: Date | string;
    exam: Prisma.ExamCreateNestedOneWithoutQuestionPapersInput;
    teacher: Prisma.TeacherCreateNestedOneWithoutQuestionPapersInput;
};
export type QuestionPaperUncheckedCreateInput = {
    id?: string;
    examId: string;
    teacherId: string;
    fileUrl: string;
    status?: $Enums.PaperStatus;
    createdAt?: Date | string;
};
export type QuestionPaperUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exam?: Prisma.ExamUpdateOneRequiredWithoutQuestionPapersNestedInput;
    teacher?: Prisma.TeacherUpdateOneRequiredWithoutQuestionPapersNestedInput;
};
export type QuestionPaperUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    examId?: Prisma.StringFieldUpdateOperationsInput | string;
    teacherId?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionPaperCreateManyInput = {
    id?: string;
    examId: string;
    teacherId: string;
    fileUrl: string;
    status?: $Enums.PaperStatus;
    createdAt?: Date | string;
};
export type QuestionPaperUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionPaperUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    examId?: Prisma.StringFieldUpdateOperationsInput | string;
    teacherId?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionPaperListRelationFilter = {
    every?: Prisma.QuestionPaperWhereInput;
    some?: Prisma.QuestionPaperWhereInput;
    none?: Prisma.QuestionPaperWhereInput;
};
export type QuestionPaperOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type QuestionPaperCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    examId?: Prisma.SortOrder;
    teacherId?: Prisma.SortOrder;
    fileUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type QuestionPaperMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    examId?: Prisma.SortOrder;
    teacherId?: Prisma.SortOrder;
    fileUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type QuestionPaperMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    examId?: Prisma.SortOrder;
    teacherId?: Prisma.SortOrder;
    fileUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type QuestionPaperCreateNestedManyWithoutTeacherInput = {
    create?: Prisma.XOR<Prisma.QuestionPaperCreateWithoutTeacherInput, Prisma.QuestionPaperUncheckedCreateWithoutTeacherInput> | Prisma.QuestionPaperCreateWithoutTeacherInput[] | Prisma.QuestionPaperUncheckedCreateWithoutTeacherInput[];
    connectOrCreate?: Prisma.QuestionPaperCreateOrConnectWithoutTeacherInput | Prisma.QuestionPaperCreateOrConnectWithoutTeacherInput[];
    createMany?: Prisma.QuestionPaperCreateManyTeacherInputEnvelope;
    connect?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
};
export type QuestionPaperUncheckedCreateNestedManyWithoutTeacherInput = {
    create?: Prisma.XOR<Prisma.QuestionPaperCreateWithoutTeacherInput, Prisma.QuestionPaperUncheckedCreateWithoutTeacherInput> | Prisma.QuestionPaperCreateWithoutTeacherInput[] | Prisma.QuestionPaperUncheckedCreateWithoutTeacherInput[];
    connectOrCreate?: Prisma.QuestionPaperCreateOrConnectWithoutTeacherInput | Prisma.QuestionPaperCreateOrConnectWithoutTeacherInput[];
    createMany?: Prisma.QuestionPaperCreateManyTeacherInputEnvelope;
    connect?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
};
export type QuestionPaperUpdateManyWithoutTeacherNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionPaperCreateWithoutTeacherInput, Prisma.QuestionPaperUncheckedCreateWithoutTeacherInput> | Prisma.QuestionPaperCreateWithoutTeacherInput[] | Prisma.QuestionPaperUncheckedCreateWithoutTeacherInput[];
    connectOrCreate?: Prisma.QuestionPaperCreateOrConnectWithoutTeacherInput | Prisma.QuestionPaperCreateOrConnectWithoutTeacherInput[];
    upsert?: Prisma.QuestionPaperUpsertWithWhereUniqueWithoutTeacherInput | Prisma.QuestionPaperUpsertWithWhereUniqueWithoutTeacherInput[];
    createMany?: Prisma.QuestionPaperCreateManyTeacherInputEnvelope;
    set?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    disconnect?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    delete?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    connect?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    update?: Prisma.QuestionPaperUpdateWithWhereUniqueWithoutTeacherInput | Prisma.QuestionPaperUpdateWithWhereUniqueWithoutTeacherInput[];
    updateMany?: Prisma.QuestionPaperUpdateManyWithWhereWithoutTeacherInput | Prisma.QuestionPaperUpdateManyWithWhereWithoutTeacherInput[];
    deleteMany?: Prisma.QuestionPaperScalarWhereInput | Prisma.QuestionPaperScalarWhereInput[];
};
export type QuestionPaperUncheckedUpdateManyWithoutTeacherNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionPaperCreateWithoutTeacherInput, Prisma.QuestionPaperUncheckedCreateWithoutTeacherInput> | Prisma.QuestionPaperCreateWithoutTeacherInput[] | Prisma.QuestionPaperUncheckedCreateWithoutTeacherInput[];
    connectOrCreate?: Prisma.QuestionPaperCreateOrConnectWithoutTeacherInput | Prisma.QuestionPaperCreateOrConnectWithoutTeacherInput[];
    upsert?: Prisma.QuestionPaperUpsertWithWhereUniqueWithoutTeacherInput | Prisma.QuestionPaperUpsertWithWhereUniqueWithoutTeacherInput[];
    createMany?: Prisma.QuestionPaperCreateManyTeacherInputEnvelope;
    set?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    disconnect?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    delete?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    connect?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    update?: Prisma.QuestionPaperUpdateWithWhereUniqueWithoutTeacherInput | Prisma.QuestionPaperUpdateWithWhereUniqueWithoutTeacherInput[];
    updateMany?: Prisma.QuestionPaperUpdateManyWithWhereWithoutTeacherInput | Prisma.QuestionPaperUpdateManyWithWhereWithoutTeacherInput[];
    deleteMany?: Prisma.QuestionPaperScalarWhereInput | Prisma.QuestionPaperScalarWhereInput[];
};
export type QuestionPaperCreateNestedManyWithoutExamInput = {
    create?: Prisma.XOR<Prisma.QuestionPaperCreateWithoutExamInput, Prisma.QuestionPaperUncheckedCreateWithoutExamInput> | Prisma.QuestionPaperCreateWithoutExamInput[] | Prisma.QuestionPaperUncheckedCreateWithoutExamInput[];
    connectOrCreate?: Prisma.QuestionPaperCreateOrConnectWithoutExamInput | Prisma.QuestionPaperCreateOrConnectWithoutExamInput[];
    createMany?: Prisma.QuestionPaperCreateManyExamInputEnvelope;
    connect?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
};
export type QuestionPaperUncheckedCreateNestedManyWithoutExamInput = {
    create?: Prisma.XOR<Prisma.QuestionPaperCreateWithoutExamInput, Prisma.QuestionPaperUncheckedCreateWithoutExamInput> | Prisma.QuestionPaperCreateWithoutExamInput[] | Prisma.QuestionPaperUncheckedCreateWithoutExamInput[];
    connectOrCreate?: Prisma.QuestionPaperCreateOrConnectWithoutExamInput | Prisma.QuestionPaperCreateOrConnectWithoutExamInput[];
    createMany?: Prisma.QuestionPaperCreateManyExamInputEnvelope;
    connect?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
};
export type QuestionPaperUpdateManyWithoutExamNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionPaperCreateWithoutExamInput, Prisma.QuestionPaperUncheckedCreateWithoutExamInput> | Prisma.QuestionPaperCreateWithoutExamInput[] | Prisma.QuestionPaperUncheckedCreateWithoutExamInput[];
    connectOrCreate?: Prisma.QuestionPaperCreateOrConnectWithoutExamInput | Prisma.QuestionPaperCreateOrConnectWithoutExamInput[];
    upsert?: Prisma.QuestionPaperUpsertWithWhereUniqueWithoutExamInput | Prisma.QuestionPaperUpsertWithWhereUniqueWithoutExamInput[];
    createMany?: Prisma.QuestionPaperCreateManyExamInputEnvelope;
    set?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    disconnect?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    delete?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    connect?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    update?: Prisma.QuestionPaperUpdateWithWhereUniqueWithoutExamInput | Prisma.QuestionPaperUpdateWithWhereUniqueWithoutExamInput[];
    updateMany?: Prisma.QuestionPaperUpdateManyWithWhereWithoutExamInput | Prisma.QuestionPaperUpdateManyWithWhereWithoutExamInput[];
    deleteMany?: Prisma.QuestionPaperScalarWhereInput | Prisma.QuestionPaperScalarWhereInput[];
};
export type QuestionPaperUncheckedUpdateManyWithoutExamNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionPaperCreateWithoutExamInput, Prisma.QuestionPaperUncheckedCreateWithoutExamInput> | Prisma.QuestionPaperCreateWithoutExamInput[] | Prisma.QuestionPaperUncheckedCreateWithoutExamInput[];
    connectOrCreate?: Prisma.QuestionPaperCreateOrConnectWithoutExamInput | Prisma.QuestionPaperCreateOrConnectWithoutExamInput[];
    upsert?: Prisma.QuestionPaperUpsertWithWhereUniqueWithoutExamInput | Prisma.QuestionPaperUpsertWithWhereUniqueWithoutExamInput[];
    createMany?: Prisma.QuestionPaperCreateManyExamInputEnvelope;
    set?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    disconnect?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    delete?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    connect?: Prisma.QuestionPaperWhereUniqueInput | Prisma.QuestionPaperWhereUniqueInput[];
    update?: Prisma.QuestionPaperUpdateWithWhereUniqueWithoutExamInput | Prisma.QuestionPaperUpdateWithWhereUniqueWithoutExamInput[];
    updateMany?: Prisma.QuestionPaperUpdateManyWithWhereWithoutExamInput | Prisma.QuestionPaperUpdateManyWithWhereWithoutExamInput[];
    deleteMany?: Prisma.QuestionPaperScalarWhereInput | Prisma.QuestionPaperScalarWhereInput[];
};
export type EnumPaperStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaperStatus;
};
export type QuestionPaperCreateWithoutTeacherInput = {
    id?: string;
    fileUrl: string;
    status?: $Enums.PaperStatus;
    createdAt?: Date | string;
    exam: Prisma.ExamCreateNestedOneWithoutQuestionPapersInput;
};
export type QuestionPaperUncheckedCreateWithoutTeacherInput = {
    id?: string;
    examId: string;
    fileUrl: string;
    status?: $Enums.PaperStatus;
    createdAt?: Date | string;
};
export type QuestionPaperCreateOrConnectWithoutTeacherInput = {
    where: Prisma.QuestionPaperWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionPaperCreateWithoutTeacherInput, Prisma.QuestionPaperUncheckedCreateWithoutTeacherInput>;
};
export type QuestionPaperCreateManyTeacherInputEnvelope = {
    data: Prisma.QuestionPaperCreateManyTeacherInput | Prisma.QuestionPaperCreateManyTeacherInput[];
    skipDuplicates?: boolean;
};
export type QuestionPaperUpsertWithWhereUniqueWithoutTeacherInput = {
    where: Prisma.QuestionPaperWhereUniqueInput;
    update: Prisma.XOR<Prisma.QuestionPaperUpdateWithoutTeacherInput, Prisma.QuestionPaperUncheckedUpdateWithoutTeacherInput>;
    create: Prisma.XOR<Prisma.QuestionPaperCreateWithoutTeacherInput, Prisma.QuestionPaperUncheckedCreateWithoutTeacherInput>;
};
export type QuestionPaperUpdateWithWhereUniqueWithoutTeacherInput = {
    where: Prisma.QuestionPaperWhereUniqueInput;
    data: Prisma.XOR<Prisma.QuestionPaperUpdateWithoutTeacherInput, Prisma.QuestionPaperUncheckedUpdateWithoutTeacherInput>;
};
export type QuestionPaperUpdateManyWithWhereWithoutTeacherInput = {
    where: Prisma.QuestionPaperScalarWhereInput;
    data: Prisma.XOR<Prisma.QuestionPaperUpdateManyMutationInput, Prisma.QuestionPaperUncheckedUpdateManyWithoutTeacherInput>;
};
export type QuestionPaperScalarWhereInput = {
    AND?: Prisma.QuestionPaperScalarWhereInput | Prisma.QuestionPaperScalarWhereInput[];
    OR?: Prisma.QuestionPaperScalarWhereInput[];
    NOT?: Prisma.QuestionPaperScalarWhereInput | Prisma.QuestionPaperScalarWhereInput[];
    id?: Prisma.StringFilter<"QuestionPaper"> | string;
    examId?: Prisma.StringFilter<"QuestionPaper"> | string;
    teacherId?: Prisma.StringFilter<"QuestionPaper"> | string;
    fileUrl?: Prisma.StringFilter<"QuestionPaper"> | string;
    status?: Prisma.EnumPaperStatusFilter<"QuestionPaper"> | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeFilter<"QuestionPaper"> | Date | string;
};
export type QuestionPaperCreateWithoutExamInput = {
    id?: string;
    fileUrl: string;
    status?: $Enums.PaperStatus;
    createdAt?: Date | string;
    teacher: Prisma.TeacherCreateNestedOneWithoutQuestionPapersInput;
};
export type QuestionPaperUncheckedCreateWithoutExamInput = {
    id?: string;
    teacherId: string;
    fileUrl: string;
    status?: $Enums.PaperStatus;
    createdAt?: Date | string;
};
export type QuestionPaperCreateOrConnectWithoutExamInput = {
    where: Prisma.QuestionPaperWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionPaperCreateWithoutExamInput, Prisma.QuestionPaperUncheckedCreateWithoutExamInput>;
};
export type QuestionPaperCreateManyExamInputEnvelope = {
    data: Prisma.QuestionPaperCreateManyExamInput | Prisma.QuestionPaperCreateManyExamInput[];
    skipDuplicates?: boolean;
};
export type QuestionPaperUpsertWithWhereUniqueWithoutExamInput = {
    where: Prisma.QuestionPaperWhereUniqueInput;
    update: Prisma.XOR<Prisma.QuestionPaperUpdateWithoutExamInput, Prisma.QuestionPaperUncheckedUpdateWithoutExamInput>;
    create: Prisma.XOR<Prisma.QuestionPaperCreateWithoutExamInput, Prisma.QuestionPaperUncheckedCreateWithoutExamInput>;
};
export type QuestionPaperUpdateWithWhereUniqueWithoutExamInput = {
    where: Prisma.QuestionPaperWhereUniqueInput;
    data: Prisma.XOR<Prisma.QuestionPaperUpdateWithoutExamInput, Prisma.QuestionPaperUncheckedUpdateWithoutExamInput>;
};
export type QuestionPaperUpdateManyWithWhereWithoutExamInput = {
    where: Prisma.QuestionPaperScalarWhereInput;
    data: Prisma.XOR<Prisma.QuestionPaperUpdateManyMutationInput, Prisma.QuestionPaperUncheckedUpdateManyWithoutExamInput>;
};
export type QuestionPaperCreateManyTeacherInput = {
    id?: string;
    examId: string;
    fileUrl: string;
    status?: $Enums.PaperStatus;
    createdAt?: Date | string;
};
export type QuestionPaperUpdateWithoutTeacherInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exam?: Prisma.ExamUpdateOneRequiredWithoutQuestionPapersNestedInput;
};
export type QuestionPaperUncheckedUpdateWithoutTeacherInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    examId?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionPaperUncheckedUpdateManyWithoutTeacherInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    examId?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionPaperCreateManyExamInput = {
    id?: string;
    teacherId: string;
    fileUrl: string;
    status?: $Enums.PaperStatus;
    createdAt?: Date | string;
};
export type QuestionPaperUpdateWithoutExamInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    teacher?: Prisma.TeacherUpdateOneRequiredWithoutQuestionPapersNestedInput;
};
export type QuestionPaperUncheckedUpdateWithoutExamInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    teacherId?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionPaperUncheckedUpdateManyWithoutExamInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    teacherId?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionPaperSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    examId?: boolean;
    teacherId?: boolean;
    fileUrl?: boolean;
    status?: boolean;
    createdAt?: boolean;
    exam?: boolean | Prisma.ExamDefaultArgs<ExtArgs>;
    teacher?: boolean | Prisma.TeacherDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["questionPaper"]>;
export type QuestionPaperSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    examId?: boolean;
    teacherId?: boolean;
    fileUrl?: boolean;
    status?: boolean;
    createdAt?: boolean;
    exam?: boolean | Prisma.ExamDefaultArgs<ExtArgs>;
    teacher?: boolean | Prisma.TeacherDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["questionPaper"]>;
export type QuestionPaperSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    examId?: boolean;
    teacherId?: boolean;
    fileUrl?: boolean;
    status?: boolean;
    createdAt?: boolean;
    exam?: boolean | Prisma.ExamDefaultArgs<ExtArgs>;
    teacher?: boolean | Prisma.TeacherDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["questionPaper"]>;
export type QuestionPaperSelectScalar = {
    id?: boolean;
    examId?: boolean;
    teacherId?: boolean;
    fileUrl?: boolean;
    status?: boolean;
    createdAt?: boolean;
};
export type QuestionPaperOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "examId" | "teacherId" | "fileUrl" | "status" | "createdAt", ExtArgs["result"]["questionPaper"]>;
export type QuestionPaperInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    exam?: boolean | Prisma.ExamDefaultArgs<ExtArgs>;
    teacher?: boolean | Prisma.TeacherDefaultArgs<ExtArgs>;
};
export type QuestionPaperIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    exam?: boolean | Prisma.ExamDefaultArgs<ExtArgs>;
    teacher?: boolean | Prisma.TeacherDefaultArgs<ExtArgs>;
};
export type QuestionPaperIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    exam?: boolean | Prisma.ExamDefaultArgs<ExtArgs>;
    teacher?: boolean | Prisma.TeacherDefaultArgs<ExtArgs>;
};
export type $QuestionPaperPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "QuestionPaper";
    objects: {
        exam: Prisma.$ExamPayload<ExtArgs>;
        teacher: Prisma.$TeacherPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        examId: string;
        teacherId: string;
        fileUrl: string;
        status: $Enums.PaperStatus;
        createdAt: Date;
    }, ExtArgs["result"]["questionPaper"]>;
    composites: {};
};
export type QuestionPaperGetPayload<S extends boolean | null | undefined | QuestionPaperDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$QuestionPaperPayload, S>;
export type QuestionPaperCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<QuestionPaperFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: QuestionPaperCountAggregateInputType | true;
};
export interface QuestionPaperDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['QuestionPaper'];
        meta: {
            name: 'QuestionPaper';
        };
    };
    /**
     * Find zero or one QuestionPaper that matches the filter.
     * @param {QuestionPaperFindUniqueArgs} args - Arguments to find a QuestionPaper
     * @example
     * // Get one QuestionPaper
     * const questionPaper = await prisma.questionPaper.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuestionPaperFindUniqueArgs>(args: Prisma.SelectSubset<T, QuestionPaperFindUniqueArgs<ExtArgs>>): Prisma.Prisma__QuestionPaperClient<runtime.Types.Result.GetResult<Prisma.$QuestionPaperPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one QuestionPaper that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuestionPaperFindUniqueOrThrowArgs} args - Arguments to find a QuestionPaper
     * @example
     * // Get one QuestionPaper
     * const questionPaper = await prisma.questionPaper.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuestionPaperFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, QuestionPaperFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuestionPaperClient<runtime.Types.Result.GetResult<Prisma.$QuestionPaperPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first QuestionPaper that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionPaperFindFirstArgs} args - Arguments to find a QuestionPaper
     * @example
     * // Get one QuestionPaper
     * const questionPaper = await prisma.questionPaper.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuestionPaperFindFirstArgs>(args?: Prisma.SelectSubset<T, QuestionPaperFindFirstArgs<ExtArgs>>): Prisma.Prisma__QuestionPaperClient<runtime.Types.Result.GetResult<Prisma.$QuestionPaperPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first QuestionPaper that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionPaperFindFirstOrThrowArgs} args - Arguments to find a QuestionPaper
     * @example
     * // Get one QuestionPaper
     * const questionPaper = await prisma.questionPaper.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuestionPaperFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, QuestionPaperFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuestionPaperClient<runtime.Types.Result.GetResult<Prisma.$QuestionPaperPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more QuestionPapers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionPaperFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuestionPapers
     * const questionPapers = await prisma.questionPaper.findMany()
     *
     * // Get first 10 QuestionPapers
     * const questionPapers = await prisma.questionPaper.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const questionPaperWithIdOnly = await prisma.questionPaper.findMany({ select: { id: true } })
     *
     */
    findMany<T extends QuestionPaperFindManyArgs>(args?: Prisma.SelectSubset<T, QuestionPaperFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPaperPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a QuestionPaper.
     * @param {QuestionPaperCreateArgs} args - Arguments to create a QuestionPaper.
     * @example
     * // Create one QuestionPaper
     * const QuestionPaper = await prisma.questionPaper.create({
     *   data: {
     *     // ... data to create a QuestionPaper
     *   }
     * })
     *
     */
    create<T extends QuestionPaperCreateArgs>(args: Prisma.SelectSubset<T, QuestionPaperCreateArgs<ExtArgs>>): Prisma.Prisma__QuestionPaperClient<runtime.Types.Result.GetResult<Prisma.$QuestionPaperPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many QuestionPapers.
     * @param {QuestionPaperCreateManyArgs} args - Arguments to create many QuestionPapers.
     * @example
     * // Create many QuestionPapers
     * const questionPaper = await prisma.questionPaper.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends QuestionPaperCreateManyArgs>(args?: Prisma.SelectSubset<T, QuestionPaperCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many QuestionPapers and returns the data saved in the database.
     * @param {QuestionPaperCreateManyAndReturnArgs} args - Arguments to create many QuestionPapers.
     * @example
     * // Create many QuestionPapers
     * const questionPaper = await prisma.questionPaper.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many QuestionPapers and only return the `id`
     * const questionPaperWithIdOnly = await prisma.questionPaper.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends QuestionPaperCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, QuestionPaperCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPaperPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a QuestionPaper.
     * @param {QuestionPaperDeleteArgs} args - Arguments to delete one QuestionPaper.
     * @example
     * // Delete one QuestionPaper
     * const QuestionPaper = await prisma.questionPaper.delete({
     *   where: {
     *     // ... filter to delete one QuestionPaper
     *   }
     * })
     *
     */
    delete<T extends QuestionPaperDeleteArgs>(args: Prisma.SelectSubset<T, QuestionPaperDeleteArgs<ExtArgs>>): Prisma.Prisma__QuestionPaperClient<runtime.Types.Result.GetResult<Prisma.$QuestionPaperPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one QuestionPaper.
     * @param {QuestionPaperUpdateArgs} args - Arguments to update one QuestionPaper.
     * @example
     * // Update one QuestionPaper
     * const questionPaper = await prisma.questionPaper.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends QuestionPaperUpdateArgs>(args: Prisma.SelectSubset<T, QuestionPaperUpdateArgs<ExtArgs>>): Prisma.Prisma__QuestionPaperClient<runtime.Types.Result.GetResult<Prisma.$QuestionPaperPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more QuestionPapers.
     * @param {QuestionPaperDeleteManyArgs} args - Arguments to filter QuestionPapers to delete.
     * @example
     * // Delete a few QuestionPapers
     * const { count } = await prisma.questionPaper.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends QuestionPaperDeleteManyArgs>(args?: Prisma.SelectSubset<T, QuestionPaperDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more QuestionPapers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionPaperUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuestionPapers
     * const questionPaper = await prisma.questionPaper.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends QuestionPaperUpdateManyArgs>(args: Prisma.SelectSubset<T, QuestionPaperUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more QuestionPapers and returns the data updated in the database.
     * @param {QuestionPaperUpdateManyAndReturnArgs} args - Arguments to update many QuestionPapers.
     * @example
     * // Update many QuestionPapers
     * const questionPaper = await prisma.questionPaper.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more QuestionPapers and only return the `id`
     * const questionPaperWithIdOnly = await prisma.questionPaper.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends QuestionPaperUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, QuestionPaperUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPaperPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one QuestionPaper.
     * @param {QuestionPaperUpsertArgs} args - Arguments to update or create a QuestionPaper.
     * @example
     * // Update or create a QuestionPaper
     * const questionPaper = await prisma.questionPaper.upsert({
     *   create: {
     *     // ... data to create a QuestionPaper
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuestionPaper we want to update
     *   }
     * })
     */
    upsert<T extends QuestionPaperUpsertArgs>(args: Prisma.SelectSubset<T, QuestionPaperUpsertArgs<ExtArgs>>): Prisma.Prisma__QuestionPaperClient<runtime.Types.Result.GetResult<Prisma.$QuestionPaperPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of QuestionPapers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionPaperCountArgs} args - Arguments to filter QuestionPapers to count.
     * @example
     * // Count the number of QuestionPapers
     * const count = await prisma.questionPaper.count({
     *   where: {
     *     // ... the filter for the QuestionPapers we want to count
     *   }
     * })
    **/
    count<T extends QuestionPaperCountArgs>(args?: Prisma.Subset<T, QuestionPaperCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], QuestionPaperCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a QuestionPaper.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionPaperAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuestionPaperAggregateArgs>(args: Prisma.Subset<T, QuestionPaperAggregateArgs>): Prisma.PrismaPromise<GetQuestionPaperAggregateType<T>>;
    /**
     * Group by QuestionPaper.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionPaperGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends QuestionPaperGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: QuestionPaperGroupByArgs['orderBy'];
    } : {
        orderBy?: QuestionPaperGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, QuestionPaperGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionPaperGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the QuestionPaper model
     */
    readonly fields: QuestionPaperFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for QuestionPaper.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__QuestionPaperClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    exam<T extends Prisma.ExamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ExamDefaultArgs<ExtArgs>>): Prisma.Prisma__ExamClient<runtime.Types.Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    teacher<T extends Prisma.TeacherDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeacherDefaultArgs<ExtArgs>>): Prisma.Prisma__TeacherClient<runtime.Types.Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the QuestionPaper model
 */
export interface QuestionPaperFieldRefs {
    readonly id: Prisma.FieldRef<"QuestionPaper", 'String'>;
    readonly examId: Prisma.FieldRef<"QuestionPaper", 'String'>;
    readonly teacherId: Prisma.FieldRef<"QuestionPaper", 'String'>;
    readonly fileUrl: Prisma.FieldRef<"QuestionPaper", 'String'>;
    readonly status: Prisma.FieldRef<"QuestionPaper", 'PaperStatus'>;
    readonly createdAt: Prisma.FieldRef<"QuestionPaper", 'DateTime'>;
}
/**
 * QuestionPaper findUnique
 */
export type QuestionPaperFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionPaper
     */
    select?: Prisma.QuestionPaperSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the QuestionPaper
     */
    omit?: Prisma.QuestionPaperOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.QuestionPaperInclude<ExtArgs> | null;
    /**
     * Filter, which QuestionPaper to fetch.
     */
    where: Prisma.QuestionPaperWhereUniqueInput;
};
/**
 * QuestionPaper findUniqueOrThrow
 */
export type QuestionPaperFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionPaper
     */
    select?: Prisma.QuestionPaperSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the QuestionPaper
     */
    omit?: Prisma.QuestionPaperOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.QuestionPaperInclude<ExtArgs> | null;
    /**
     * Filter, which QuestionPaper to fetch.
     */
    where: Prisma.QuestionPaperWhereUniqueInput;
};
/**
 * QuestionPaper findFirst
 */
export type QuestionPaperFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionPaper
     */
    select?: Prisma.QuestionPaperSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the QuestionPaper
     */
    omit?: Prisma.QuestionPaperOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.QuestionPaperInclude<ExtArgs> | null;
    /**
     * Filter, which QuestionPaper to fetch.
     */
    where?: Prisma.QuestionPaperWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of QuestionPapers to fetch.
     */
    orderBy?: Prisma.QuestionPaperOrderByWithRelationInput | Prisma.QuestionPaperOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for QuestionPapers.
     */
    cursor?: Prisma.QuestionPaperWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` QuestionPapers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` QuestionPapers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of QuestionPapers.
     */
    distinct?: Prisma.QuestionPaperScalarFieldEnum | Prisma.QuestionPaperScalarFieldEnum[];
};
/**
 * QuestionPaper findFirstOrThrow
 */
export type QuestionPaperFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionPaper
     */
    select?: Prisma.QuestionPaperSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the QuestionPaper
     */
    omit?: Prisma.QuestionPaperOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.QuestionPaperInclude<ExtArgs> | null;
    /**
     * Filter, which QuestionPaper to fetch.
     */
    where?: Prisma.QuestionPaperWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of QuestionPapers to fetch.
     */
    orderBy?: Prisma.QuestionPaperOrderByWithRelationInput | Prisma.QuestionPaperOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for QuestionPapers.
     */
    cursor?: Prisma.QuestionPaperWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` QuestionPapers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` QuestionPapers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of QuestionPapers.
     */
    distinct?: Prisma.QuestionPaperScalarFieldEnum | Prisma.QuestionPaperScalarFieldEnum[];
};
/**
 * QuestionPaper findMany
 */
export type QuestionPaperFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionPaper
     */
    select?: Prisma.QuestionPaperSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the QuestionPaper
     */
    omit?: Prisma.QuestionPaperOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.QuestionPaperInclude<ExtArgs> | null;
    /**
     * Filter, which QuestionPapers to fetch.
     */
    where?: Prisma.QuestionPaperWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of QuestionPapers to fetch.
     */
    orderBy?: Prisma.QuestionPaperOrderByWithRelationInput | Prisma.QuestionPaperOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing QuestionPapers.
     */
    cursor?: Prisma.QuestionPaperWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` QuestionPapers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` QuestionPapers.
     */
    skip?: number;
    distinct?: Prisma.QuestionPaperScalarFieldEnum | Prisma.QuestionPaperScalarFieldEnum[];
};
/**
 * QuestionPaper create
 */
export type QuestionPaperCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionPaper
     */
    select?: Prisma.QuestionPaperSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the QuestionPaper
     */
    omit?: Prisma.QuestionPaperOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.QuestionPaperInclude<ExtArgs> | null;
    /**
     * The data needed to create a QuestionPaper.
     */
    data: Prisma.XOR<Prisma.QuestionPaperCreateInput, Prisma.QuestionPaperUncheckedCreateInput>;
};
/**
 * QuestionPaper createMany
 */
export type QuestionPaperCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuestionPapers.
     */
    data: Prisma.QuestionPaperCreateManyInput | Prisma.QuestionPaperCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * QuestionPaper createManyAndReturn
 */
export type QuestionPaperCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionPaper
     */
    select?: Prisma.QuestionPaperSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the QuestionPaper
     */
    omit?: Prisma.QuestionPaperOmit<ExtArgs> | null;
    /**
     * The data used to create many QuestionPapers.
     */
    data: Prisma.QuestionPaperCreateManyInput | Prisma.QuestionPaperCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.QuestionPaperIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * QuestionPaper update
 */
export type QuestionPaperUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionPaper
     */
    select?: Prisma.QuestionPaperSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the QuestionPaper
     */
    omit?: Prisma.QuestionPaperOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.QuestionPaperInclude<ExtArgs> | null;
    /**
     * The data needed to update a QuestionPaper.
     */
    data: Prisma.XOR<Prisma.QuestionPaperUpdateInput, Prisma.QuestionPaperUncheckedUpdateInput>;
    /**
     * Choose, which QuestionPaper to update.
     */
    where: Prisma.QuestionPaperWhereUniqueInput;
};
/**
 * QuestionPaper updateMany
 */
export type QuestionPaperUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update QuestionPapers.
     */
    data: Prisma.XOR<Prisma.QuestionPaperUpdateManyMutationInput, Prisma.QuestionPaperUncheckedUpdateManyInput>;
    /**
     * Filter which QuestionPapers to update
     */
    where?: Prisma.QuestionPaperWhereInput;
    /**
     * Limit how many QuestionPapers to update.
     */
    limit?: number;
};
/**
 * QuestionPaper updateManyAndReturn
 */
export type QuestionPaperUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionPaper
     */
    select?: Prisma.QuestionPaperSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the QuestionPaper
     */
    omit?: Prisma.QuestionPaperOmit<ExtArgs> | null;
    /**
     * The data used to update QuestionPapers.
     */
    data: Prisma.XOR<Prisma.QuestionPaperUpdateManyMutationInput, Prisma.QuestionPaperUncheckedUpdateManyInput>;
    /**
     * Filter which QuestionPapers to update
     */
    where?: Prisma.QuestionPaperWhereInput;
    /**
     * Limit how many QuestionPapers to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.QuestionPaperIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * QuestionPaper upsert
 */
export type QuestionPaperUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionPaper
     */
    select?: Prisma.QuestionPaperSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the QuestionPaper
     */
    omit?: Prisma.QuestionPaperOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.QuestionPaperInclude<ExtArgs> | null;
    /**
     * The filter to search for the QuestionPaper to update in case it exists.
     */
    where: Prisma.QuestionPaperWhereUniqueInput;
    /**
     * In case the QuestionPaper found by the `where` argument doesn't exist, create a new QuestionPaper with this data.
     */
    create: Prisma.XOR<Prisma.QuestionPaperCreateInput, Prisma.QuestionPaperUncheckedCreateInput>;
    /**
     * In case the QuestionPaper was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.QuestionPaperUpdateInput, Prisma.QuestionPaperUncheckedUpdateInput>;
};
/**
 * QuestionPaper delete
 */
export type QuestionPaperDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionPaper
     */
    select?: Prisma.QuestionPaperSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the QuestionPaper
     */
    omit?: Prisma.QuestionPaperOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.QuestionPaperInclude<ExtArgs> | null;
    /**
     * Filter which QuestionPaper to delete.
     */
    where: Prisma.QuestionPaperWhereUniqueInput;
};
/**
 * QuestionPaper deleteMany
 */
export type QuestionPaperDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which QuestionPapers to delete
     */
    where?: Prisma.QuestionPaperWhereInput;
    /**
     * Limit how many QuestionPapers to delete.
     */
    limit?: number;
};
/**
 * QuestionPaper without action
 */
export type QuestionPaperDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionPaper
     */
    select?: Prisma.QuestionPaperSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the QuestionPaper
     */
    omit?: Prisma.QuestionPaperOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.QuestionPaperInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=QuestionPaper.d.ts.map