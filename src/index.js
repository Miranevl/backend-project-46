import _ from 'lodash';
import path, { basename } from 'path';
import fs from 'fs';

const genInfo = (file1, file2) => {
    const keysData1 = Object.keys(file1);
    const keysData2 = Object.keys(file2);
    const allKeysandValues = _.sortBy(_.union([...keysData1, ...keysData2]));
    const result = allKeysandValues.map((key) => {
      const value1 = file1[key];
      const value2 = file2[key];
      if ((Object.hasOwn(file1, key) && Object.hasOwn(file2, key) && (value1 !== value2))) {
        return {
          type: 'changed',
          key,
          value1,
          value2
        };
      }
      if (Object.hasOwn(file1, key) && !Object.hasOwn(file2, key)) {
        return {
          type: 'deleted',
          key,
          value: value1
        };
      }
      if (Object.hasOwn(file2, key) && !Object.hasOwn(file1, key)) {
        return {
          type: 'added',
          key,
          value: value2
        };
      }
      return {
        type: 'unchanged',
        key,
        value: value1
      };
    });
    return result;
  }
  

export const genDiff = (filepath1,filepath2) => {
const dataFile1 = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), filepath1),'utf8'));
const dataFile2 = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), filepath2),'utf8'));

const result = genInfo(dataFile1, dataFile2);
const diffResult = result.map((diff) => {
  const getType = diff.type;
  switch (getType) {
    case 'changed':
      return `- ${diff.key}: ${diff.value1}
+ ${diff.key}: ${diff.value2}`;
    case 'deleted':
      return `- ${diff.key}: ${diff.value}`;
    case 'added':
      return `+ ${diff.key}: ${diff.value}`;
    case 'unchanged':
      return `  ${diff.key}: ${diff.value}`;
    default:
      return null;
  }
});
return console.log(diffResult.join('\n'));
};