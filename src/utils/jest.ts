import {getOptions} from './getOptions';
import path from 'path';
import * as exec from '@actions/exec';

export const reportersExtensions = [
  '--reporters',
  path.resolve(__dirname, '../jest-reporters/failed-reporter.js'),
  '--reporters',
  path.resolve(__dirname, '../jest-reporters/summary-reporter.js'),
];

/**
 * Runs Jest test sript
 * includes "failed-reporter" & "summary-reporter" by default
 *
 * @export
 * @param {string[]} args - Additional flags
 * @returns {number} execution result
 */
export async function runJestTests(args: string[] = []): Promise<number> {
  const {path, flags: flagsOptions, scriptName} = getOptions();

  const execOptions = {cwd: path};

  // TODO reporters argument should be after all others https://github.com/facebook/jest/issues/10257
  const flags = [...flagsOptions, ...args, ...reportersExtensions];

  return await exec.exec('yarn', [scriptName, ...flags], execOptions);
}
