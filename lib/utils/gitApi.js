"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
 * Return list of files that was touched in PR
 *
 * @export
 * @param {string} token - Github token
 * @returns {Octokit.PullsListFilesResponse}
 */
function getPullRequestTargetFilesByAPI(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = github.context;
        const api = new github.GitHub(token);
        const { owner, repo } = context.repo;
        if (!context.payload.pull_request) {
            throw new Error('It seems like you run this action not on PR');
        }
        const { number } = context.payload.pull_request;
        const { data: files } = yield api.pulls.listFiles({
            owner,
            repo,
            pull_number: number,
        });
        return files;
    });
}
exports.getPullRequestTargetFilesByAPI = getPullRequestTargetFilesByAPI;
