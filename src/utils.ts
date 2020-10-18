import Octokit = require('@octokit/rest');

/**
 * Return should we run all unit tests or not.
 * We should run all tests if some files on the root level were touched
 * for example "package.json", but shouldn't handle in specific way changes in 
 * __specs__ or any another directory.
 *
 * @export
 * @param {Octokit.PullsListFilesResponseItem[]} files
 * @returns {boolean}
 */
export function getIsRunAllTests(files: Octokit.PullsListFilesResponseItem[]): boolean {
  return files.some(file => !file.filename.includes('modules') && !file.filename.match(/(.\/)/))
}

/**
 * Return list of non-test files from modules folder that was touched in PR
 *
 * @export
 * @param {Octokit.PullsListFilesResponseItem[]} files
 * @returns {string[]}
 */
export function filterFiles(files: Octokit.PullsListFilesResponseItem[]): string[] {
  return files
    .map(file => file.filename)
    .filter(name => !name.match(/(\.test\.)|(\.snap\.)/) && name.includes('modules'))
}