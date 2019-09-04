import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const context = github.context;
    console.log(context);
    console.log(context.payload.pull_request);
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
