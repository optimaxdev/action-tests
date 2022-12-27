"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
function getOptions() {
    const gitHubToken = core.getInput('token', { required: true });
    const path = core.getInput('working-directory', { required: false }) || './';
    const scriptName = core.getInput('scriptName', { required: false }) || 'test';
    const flags = core
        .getInput('jest-flags', { required: false })
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
exports.getOptions = getOptions;
