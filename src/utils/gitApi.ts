import Octokit from '@octokit/rest';
import * as github from '@actions/github';

/**
 * Return list of files that was touched in PR
 *
 * @export
 * @param {string} token - Github token
 * @returns {Octokit.PullsListFilesResponse}
 */
export async function getPullRequestTargetFilesByAPI(
  token: string,
): Promise<Octokit.PullsListFilesResponse> {
  const context = github.context;
  const api = new github.GitHub(token);
  const {owner, repo} = context.repo;

  if (!context.payload.pull_request) {
    throw new Error('It seems like you run this action not on PR');
  }

  const {number} = context.payload.pull_request;

  const {data: files} = await api.pulls.listFiles({
    owner,
    repo,
    pull_number: number,
  });

  return files;
}
