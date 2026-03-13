export type CsvValue = string | number | boolean | null | undefined | Date;
export type CsvRow = Record<string, CsvValue>;
export declare function buildCsv(rows: CsvRow[], preferredHeaders?: string[]): string;
//# sourceMappingURL=csv.d.ts.map