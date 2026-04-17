"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGrade = calculateGrade;
function calculateGrade(percentage) {
    if (percentage >= 90)
        return "A+";
    if (percentage >= 80)
        return "A";
    if (percentage >= 70)
        return "B+";
    if (percentage >= 60)
        return "B";
    if (percentage >= 50)
        return "C";
    if (percentage >= 40)
        return "D";
    return "F";
}
