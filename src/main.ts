import * as core from '@actions/core';
import * as github from '@actions/github';
import * as exec from '@actions/exec';

async function run() {
  try {
    const context = github.context;
    if (context.payload.pull_request) {
      const {number, changed_files = 0} = context.payload.pull_request;

      if (changed_files > 100) {
        exec.exec('yarn && yarn test');
      } else {
        console.log(context.payload.pull_request.head);
      }
    }
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
