import Octokit = require('@octokit/rest');

export function filterFiles(files: Octokit.PullsListFilesResponseItem[]): string[] {
  return files
    .map(file => file.filename)
    .filter(name => !name.match(/(\.test\.)|(\.snap\.)/) && name.includes('modules'))
}