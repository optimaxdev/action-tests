import * as core from '@actions/core';
import * as github from '@actions/github';
import * as exec from '@actions/exec';
import {filterFiles} from './utils';

async function run() {
  try {
    const gitHubToken = core.getInput('token', {required: true});
    const context = github.context;
    const api = new github.GitHub(gitHubToken);
    const {owner, repo} = context.repo;

    if (context.payload.pull_request) {
      const {number, changed_files = 0} = context.payload.pull_request;

      if (changed_files > 100) {
        await exec.exec('yarn test');
      } else {
        const {data: files} = await api.pulls.listFiles({
          owner,
          repo,
          pull_number: number
        });
        const fileNames = filterFiles(files);
        await exec.exec(`yarn jest ${fileNames.length > 0 ? '--findRelatedTests': '--maxWorkers=4'} ${fileNames.join(' ')}`);
      }
    } else {
      throw new Error('It seems like you run this action not on PR');
    }
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
