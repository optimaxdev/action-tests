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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const exec = __importStar(require("@actions/exec"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const failed_reporter_js_1 = __importDefault(require("./jest-reporters/failed-reporter.js"));
const summary_reporter_js_1 = __importDefault(require("./jest-reporters/summary-reporter.js"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // TODO - it's used to parse it with typescript
            if (!failed_reporter_js_1.default) {
                throw new Error('Failed reporter does not exists');
            }
            if (!summary_reporter_js_1.default) {
                throw new Error('Summary reporter does not exists');
            }
            const gitHubToken = core.getInput('token', { required: true });
            const path = core.getInput('working-directory', { required: false });
            const flags = core.getInput('jest-flags', { required: false }).split(' ').map(flag => flag.trim());
            const workingDirPath = path || './';
            const context = github.context;
            const api = new github.GitHub(gitHubToken);
            const { owner, repo } = context.repo;
            if (context.payload.pull_request) {
                const { number, changed_files = 0 } = context.payload.pull_request;
                const exacOptions = { cwd: workingDirPath };
                // TODO reporters argument should be after all others https://github.com/facebook/jest/issues/10257
                const reportersCMD = [
                    '--reporters', path_1.default.resolve(__dirname, './jest-reporters/failed-reporter.js'),
                    '--reporters', path_1.default.resolve(__dirname, './jest-reporters/summary-reporter.js'),
                ];
                /**
                 * Run all unit tests
                 *
                 */
                function runAllTests() {
                    return __awaiter(this, void 0, void 0, function* () {
                        exec.exec('yarn', ['test', ...flags, ...reportersCMD], exacOptions);
                    });
                }
                if (changed_files > 100) {
                    yield runAllTests();
                }
                else {
                    const { data: files } = yield api.pulls.listFiles({
                        owner,
                        repo,
                        pull_number: number
                    });
                    if (utils_1.getIsRunAllTests(files)) {
                        yield runAllTests();
                    }
                    else {
                        const fileNames = utils_1.filterFiles(files);
                        yield exec.exec('yarn', ['jest', ...flags, fileNames.length > 0 ? '--findRelatedTests' : '', ...fileNames, ...reportersCMD], exacOptions);
                    }
                }
            }
            else {
                throw new Error('It seems like you run this action not on PR');
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
