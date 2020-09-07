const {DefaultReporter} = require('@jest/reporters');

class JestFailureReporter extends DefaultReporter {
    onTestResult(test: any, testResult: any, aggregatedResults: any) {
        /** Show the result if a test is failed */
        if (testResult && testResult.failureMessage) {
            super.onTestResult(test, testResult, aggregatedResults);
        }
    }
};

export default JestFailureReporter;
