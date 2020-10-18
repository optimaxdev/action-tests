import Octokit from '@octokit/rest';
import {filterFiles, getIsRunAllTests} from '../src/utils';

describe('Utils', () => {
  describe('filterFiles function', () => {
    it('should filter out tests files', () => {
      const files = [
        {filename: './modules/components/someComponent/someComponent.tsx'},
        {filename: './modules/components/someComponent/someComponent.test.tsx'},
        {filename: './modules/components/someComponent/someComponent.snap.tsx'},
      ];

      expect(filterFiles(files as Octokit.PullsListFilesResponseItem[])).toEqual(['./modules/components/someComponent/someComponent.tsx']);
    });

    it('should return only files from modules directory', () => {
      const files = [
        {filename: './modules/components/someComponent/someComponent.tsx'},
        {filename: './yarn.lock'},
      ];

      expect(filterFiles(files as Octokit.PullsListFilesResponseItem[])).toEqual(['./modules/components/someComponent/someComponent.tsx']);
    });
  });

  describe('getIsRunAllTests function', () => {
    it('should return true if files on the root level were passed', () => {
        expect(getIsRunAllTests([{filename: '/package.json'}] as Octokit.PullsListFilesResponseItem[])).toBe(true);
        expect(getIsRunAllTests([{filename: 'package.json'}] as Octokit.PullsListFilesResponseItem[])).toBe(true);
    });

    it('should return false if files from another folders were passed', () => {
        const files: Partial<Octokit.PullsListFilesResponseItem>[] = [
            {
                filename: 'modules/oneMoreFile.js'
            },
            {
                filename: '__specs__/someFile.ts'
            }, 
            {
                filename: 'modules/anotherDir/anotherfile.jsx'
            }, 
            {
                filename: 'modules/oneMoreFile.tsx'
            },
        ];

        expect(getIsRunAllTests(files as Octokit.PullsListFilesResponseItem[])).toBe(false);
    });
})
});