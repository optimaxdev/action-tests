import {filterFiles} from '../src/utils';

describe('Utils', () => {
  describe('filterFiles function', () => {
    it('should filter out tests files', () => {
      const files = [
        {filename: './modules/components/someComponent/someComponent.tsx'},
        {filename: './modules/components/someComponent/someComponent.test.tsx'},
        {filename: './modules/components/someComponent/someComponent.snap.tsx'},
      ];
      // @ts-ignore
      expect(filterFiles(files)).toEqual(['./modules/components/someComponent/someComponent.tsx']);
    });

    it('should return only files from modules directory', () => {
      const files = [
        {filename: './modules/components/someComponent/someComponent.tsx'},
        {filename: './yarn.lock'},
      ];
      // @ts-ignore
      expect(filterFiles(files)).toEqual(['./modules/components/someComponent/someComponent.tsx']);
    });
  });
});