import {DefaultReporter} from '@jest/reporters';
import {Test} from '@jest/reporters/build/types';
import {AggregatedResult, TestResult} from '@jest/test-result';

class JestFailureReporter extends DefaultReporter {
    onTestResult(test: Test, testResult: TestResult, aggregatedResults: AggregatedResult) {
        /** Show the result if a test is failed */
        if (testResult && testResult.failureMessage) {
            super.onTestResult(test, testResult, aggregatedResults);
        }
    }
};

export default JestFailureReporter;