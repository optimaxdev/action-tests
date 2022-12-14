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
const failed_reporter_js_1 = __importDefault(require("./jest-reporters/failed-reporter.js"));
const summary_reporter_js_1 = __importDefault(require("./jest-reporters/summary-reporter.js"));
const getOptions_1 = require("./utils/getOptions");
const jest_1 = require("./utils/jest");
const gitApi_1 = require("./utils/gitApi");
const files_js_1 = require("./utils/files.js");
const reportError = (error) => core.setFailed(error.message);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO - it's used to parse it with typescript
        if (!failed_reporter_js_1.default) {
            throw new Error('Failed reporter does not exists');
        }
        if (!summary_reporter_js_1.default) {
            throw new Error('Summary reporter does not exists');
        }
        const { gitHubToken } = getOptions_1.getOptions();
        const prChangedFiles = yield gitApi_1.getPullRequestTargetFilesByAPI(gitHubToken);
        const testableFiles = files_js_1.filterFiles(prChangedFiles);
        if (prChangedFiles.length > 100 ||
            files_js_1.isRootFilesTouched(prChangedFiles) ||
            testableFiles.length === 0) {
            // Run all tests
            return yield jest_1.runJestTests();
        }
        // Run only affected files
        return yield jest_1.runJestTests(['--findRelatedTests', ...testableFiles]);
    });
}
run().catch(reportError);
