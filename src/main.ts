import * as core from '@actions/core';
import * as github from '@actions/github';
import * as exec from '@actions/exec';

async function run() {
  try {
    const gitHubToken = core.getInput('token', {required: true});
    const context = github.context;
    const api = new github.GitHub(gitHubToken);
    const {owner, repo} = context.repo;
    if (context.payload.pull_request) {
      const {number, changed_files = 0} = context.payload.pull_request;

      if (changed_files > 100) {
        exec.exec('yarn && yarn test');
      } else {
        const files = await api.pulls.listFiles({
          owner,
          repo,
          pull_number: number
        });

        console.log(files);
        
      }
    }
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
