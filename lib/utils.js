"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function getIsRunAllTests(files) {
    return files.some(file => !file.filename.includes('modules') && !file.filename.match(/(.\/)/));
}
exports.getIsRunAllTests = getIsRunAllTests;
/**
 * Return list of non-test files from modules folder that was touched in PR
 *
 * @export
 * @param {Octokit.PullsListFilesResponseItem[]} files
 * @returns {string[]}
 */
function filterFiles(files) {
    return files
        .map(file => file.filename)
        .filter(name => !name.match(/(\.test\.)|(\.snap\.)/) && name.includes('modules'));
}
exports.filterFiles = filterFiles;
