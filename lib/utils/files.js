"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const github = __importStar(require("@actions/github"));
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
function isRootFilesTouched(files) {
    return files.some(file => !file.filename.includes('modules') && !file.filename.match(/(.\/)/));
}
exports.isRootFilesTouched = isRootFilesTouched;
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
/**
 * Return count of files that was touched in PR
 *
 * @export
 * @returns {number} count of touched files in PR
 */
function getPRTouchedFilesCountFromContext() {
    const context = github.context;
    if (!context.payload.pull_request) {
        throw new Error('It seems like you run this action not on PR');
    }
    const { changed_files = 0 } = context.payload.pull_request;
    return changed_files;
}
exports.getPRTouchedFilesCountFromContext = getPRTouchedFilesCountFromContext;
