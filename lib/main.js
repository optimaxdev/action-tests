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
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const exec = __importStar(require("@actions/exec"));
const utils_1 = require("./utils");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const gitHubToken = core.getInput('token', { required: true });
            const context = github.context;
            const api = new github.GitHub(gitHubToken);
            const { owner, repo } = context.repo;
            if (context.payload.pull_request) {
                const { number, changed_files = 0 } = context.payload.pull_request;
                yield exec.exec(`git config --global url."https://${gitHubToken}@github.com/".insteadOf ssh://git@github.com/`);
                yield exec.exec('yarn');
                if (changed_files > 100) {
                    yield exec.exec('yarn test');
                }
                else {
                    const { data: files } = yield api.pulls.listFiles({
                        owner,
                        repo,
                        pull_number: number
                    });
                    const fileNames = utils_1.filterFiles(files);
                    yield exec.exec(`yarn jest --findRelatedTests ${fileNames.join(' ')}`);
                }
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
