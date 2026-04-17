"use strict";
/**
 * Utility functions for handling Express query and params
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryString = getQueryString;
exports.getQueryNumber = getQueryNumber;
exports.asQueryString = asQueryString;
/**
 * Safely extract a string from query/params
 * Handles string, string[], and ParsedQs types
 */
function getQueryString(value) {
    if (!value)
        return undefined;
    if (typeof value === "string")
        return value;
    if (Array.isArray(value)) {
        const first = value[0];
        if (typeof first === "string")
            return first;
        return undefined;
    }
    return undefined;
}
/**
 * Safely extract a number from query/params
 */
function getQueryNumber(value, defaultValue = 0) {
    const str = getQueryString(value);
    if (!str)
        return defaultValue;
    const num = parseInt(str, 10);
    return isNaN(num) ? defaultValue : num;
}
/**
 * Safely parse query parameter as string with type narrowing
 * Use this to tell TypeScript a value is definitely a string
 */
function asQueryString(value) {
    if (!value)
        return "";
    if (Array.isArray(value))
        return value[0] || "";
    return value;
}
