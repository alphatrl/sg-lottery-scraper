import { isEqual } from 'lodash';
/**
 * @param new_list lottery results retrieved from scrapping
 * @param old_list lottery results retrieved from server
 * @returns [ name of keys which differ ]
 *
 * Compare oldList and newList
 * Returns: a list of keys which differ from the 2 lists
 */

export default function getListKeyDifference<T>(
  new_list: T,
  old_list: T | Record<string, unknown>
): string[] {
  const different_list = [];

  console.log('---------- Comparing List ----------');

  // if old_list dont exist, for example, the code is init
  // for the first time and the server is empty...
  if (Object.keys(old_list).length === 0) {
    console.log('[INFO] Previous JSON does not exist. Starting anew');
    for (const key in new_list) {
      different_list.push(key);
    }
    return different_list;
  }

  for (const key in new_list) {
    if (!isEqual(new_list[key], old_list[key])) {
      console.log(`[${key}]: Fetched new data`);
      different_list.push(key);
    } else {
      console.log(`[${key}]: No difference`);
    }
  }
  return different_list;
}
