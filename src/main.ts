import * as core from '@actions/core';
import * as github from '@actions/github';
import * as exec from '@actions/exec';
import pathModule from 'path';
import {filterFiles, getIsRunAllTests} from './utils';
import failedReporter from './jest-reporters/failed-reporter.js';
import summaryReporter from './jest-reporters/summary-reporter.js';

async function run() {
  try {
    // TODO - it's used to parse it with typescript
    if (!failedReporter) {
      throw new Error('Failed reporter does not exists');
    }
    if (!summaryReporter) {
      throw new Error('Summary reporter does not exists');
    }
    const gitHubToken = core.getInput('token', {required: true});
    const path = core.getInput('working-directory', {required: false});
    const flags = core.getInput('jest-flags', {required: false}).split(' ').map(flag => flag.trim());

    const workingDirPath = path || './';
    const context = github.context;
    const api = new github.GitHub(gitHubToken);
    const {owner, repo} = context.repo;

    if (context.payload.pull_request) {
      const {number, changed_files = 0} = context.payload.pull_request;

      const exacOptions = {cwd: workingDirPath}
      // TODO reporters argument should be after all others https://github.com/facebook/jest/issues/10257
      const reportersCMD = [
        '--reporters', pathModule.resolve(__dirname, './jest-reporters/failed-reporter.js'),
        '--reporters', pathModule.resolve(__dirname, './jest-reporters/summary-reporter.js'),
      ];

      /**
       * Run all unit tests
       *
       */
      async function runAllTests() {
        await exec.exec('npm run', ['test', ...flags, ...reportersCMD], exacOptions);
      }

      if (changed_files > 100) {
        await runAllTests();
      } else {
        const {data: files} = await api.pulls.listFiles({
          owner,
          repo,
          pull_number: number
        });

        if(getIsRunAllTests(files)) {
          await runAllTests();
        } else {
          const fileNames = filterFiles(files);
          await exec.exec('jest', [...flags, fileNames.length > 0 ? '--findRelatedTests': '', ...fileNames, ...reportersCMD], exacOptions);
        }
      }
    } else {
      throw new Error('It seems like you run this action not on PR');
    }
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
