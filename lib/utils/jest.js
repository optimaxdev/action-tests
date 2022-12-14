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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const getOptions_1 = require("./getOptions");
const path_1 = __importDefault(require("path"));
const exec = __importStar(require("@actions/exec"));
exports.reportersExtensions = [
    '--reporters',
    path_1.default.resolve(__dirname, '../jest-reporters/failed-reporter.js'),
    '--reporters',
    path_1.default.resolve(__dirname, '../jest-reporters/summary-reporter.js'),
];
/**
 * Runs Jest test sript
 * includes "failed-reporter" & "summary-reporter" by default
 *
 * @export
 * @param {string[]} args - Additional flags
 * @returns {number} execution result
 */
function runJestTests(args = []) {
    return __awaiter(this, void 0, void 0, function* () {
        const { path, flags: flagsOptions, scriptName } = getOptions_1.getOptions();
        const execOptions = { cwd: path };
        // TODO reporters argument should be after all others https://github.com/facebook/jest/issues/10257
        const flags = [...flagsOptions, ...args, ...exports.reportersExtensions];
        return yield exec.exec('yarn', [scriptName, ...flags], execOptions);
    });
}
exports.runJestTests = runJestTests;
