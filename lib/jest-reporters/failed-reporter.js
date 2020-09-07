"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DefaultReporter } = require('@jest/reporters');
class JestFailureReporter extends DefaultReporter {
    onTestResult(test, testResult, aggregatedResults) {
        /** Show the result if a test is failed */
        if (testResult && testResult.failureMessage) {
            super.onTestResult(test, testResult, aggregatedResults);
        }
    }
}
;
exports.default = JestFailureReporter;
