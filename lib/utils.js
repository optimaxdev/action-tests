"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function filterFiles(files) {
    return files
        .map(file => file.filename)
        .filter(name => !name.match(/(\.test\.)|(\.snap\.)/) && name.includes('modules'));
}
exports.filterFiles = filterFiles;
