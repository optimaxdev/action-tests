import * as core from '@actions/core';
import failedReporter from './jest-reporters/failed-reporter.js';
import summaryReporter from './jest-reporters/summary-reporter.js';
import {getOptions} from './utils/getOptions';
import {runJestTests} from './utils/jest';
import {getPullRequestTargetFilesByAPI} from './utils/gitApi';
import {filterFiles, isRootFilesTouched} from './utils/files.js';

const reportError = (error: Error): void => core.setFailed(error.message);

async function run() {
  // TODO - it's used to parse it with typescript
  if (!failedReporter) {
    throw new Error('Failed reporter does not exists');
  }
  if (!summaryReporter) {
    throw new Error('Summary reporter does not exists');
  }

  const {gitHubToken, flagsOnRelatedRun} = getOptions();

  const prChangedFiles = await getPullRequestTargetFilesByAPI(gitHubToken);
  const testableFiles = filterFiles(prChangedFiles);

  const isRunningAllTests =
    prChangedFiles.length > 100 || isRootFilesTouched(prChangedFiles) || testableFiles.length === 0;

  core.setOutput('isRunningOnlyRelated', String(!isRunningAllTests));

  if (isRunningAllTests) {
    // Run all tests
    return await runJestTests();
  }

  // Run only affected files
  return await runJestTests([...flagsOnRelatedRun, '--findRelatedTests', ...testableFiles]);
}

run().catch(reportError);
