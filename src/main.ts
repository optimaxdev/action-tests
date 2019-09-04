// import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const context = github.context;
    console.log(context);
    
  } catch (error) {
    console.log(error);
  }
}

run();
