function escapeCsvValue(value) {
    if (value === null || value === undefined) {
        return "";
    }
    const stringValue = value instanceof Date ? value.toISOString() : String(value);
    const escaped = stringValue.replace(/"/g, '""');
    if (/[",\n\r]/.test(escaped)) {
        return `"${escaped}"`;
    }
    return escaped;
}
export function buildCsv(rows, preferredHeaders) {
    if (rows.length === 0) {
        const headers = preferredHeaders ?? [];
        return headers.length ? `${headers.join(",")}\n` : "";
    }
    const headers = preferredHeaders && preferredHeaders.length
        ? preferredHeaders
        : Object.keys(rows[0]);
    const lines = [headers.join(",")];
    for (const row of rows) {
        const values = headers.map((header) => escapeCsvValue(row[header]));
        lines.push(values.join(","));
    }
    return `${lines.join("\n")}\n`;
}
//# sourceMappingURL=csv.js.map