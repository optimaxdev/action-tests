"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reporters_1 = require("@jest/reporters");
class JestFailureReporter extends reporters_1.DefaultReporter {
    onTestResult(test, testResult, aggregatedResults) {
        /** Show the result if a test is failed */
        if (testResult && testResult.failureMessage) {
            super.onTestResult(test, testResult, aggregatedResults);
        }
    }
}
;
exports.default = JestFailureReporter;
