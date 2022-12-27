import * as core from '@actions/core';

type Options = {
  gitHubToken: string;
  path: string;
  flags: string[];
  scriptName: string;
  flagsOnRelatedRun: string[];
};

export function getOptions(): Options {
  const gitHubToken = core.getInput('token', {required: true});
  const path = core.getInput('working-directory', {required: false}) || './';
  const scriptName = core.getInput('scriptName', {required: false}) || 'test';
  
	const flags = core
    .getInput('jest-flags', {required: false})
    .split(' ')
    .map(flag => flag.trim());
  
	const flagsOnRelatedRun = core
    .getInput('flags-on-related-files-run')
    .split(' ')
    .map(flag => flag.trim());

  return {
    gitHubToken,
    path,
    flags,
    scriptName,
		flagsOnRelatedRun
  };
}
