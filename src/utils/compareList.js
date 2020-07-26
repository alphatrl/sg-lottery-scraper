/**
 * @param {import('puppeteer').Browser} browser
 * @param returns Promise(list)
 * 
 * Compare oldList and newList
 * Returns 
 *  * final_list (in case newList is missing types)
 *  * list of booleans
 */


const getFinalList = async (new_list, old_list = {}) => {
  var is_different_list = {};
  var lottery_list = {};

  // if old_list dont exist, e.g. 1st init
  if (old_list.length === 0 ) { 
    for (let key in new_list) {
      is_different_list[key] = true;
    }
    return [new_list, is_different_list];
  }

  // if new_list fail to get any data, return the old_list instead
  if (new_list.length === 0 ) {
    for (let key in old_list) {
      is_different_list[key] = false;
    }
    return [old_list, is_different_list]
  }

  // verifyData
  for (let key in new_list) {
    
    // check if key exist in old_list
    // if key doesnt exist, write to final_list immediately
    // else compare the differences for errors
    if (!(key in old_list)) {
      lottery_list[key] = new_list[key];
      is_different_list[key] = true;
      console.log(`[${key}]: Fetched new data`);
    }
    
    else {
      // if there is an issue if new_list, use previous data
      if (new_list[key] === undefined) {
        lottery_list[key] = old_list[key];
        is_different_list[key] = false;
        console.log(`[${key}]: ERROR unable to obtain latest data`);
      } else {
        // there is a difference between the array
        if (JSON.stringify(new_list[key]) !== JSON.stringify(old_list[key])) {
          is_different_list[key] = true;
          console.log(`[${key}]: Fetched new data`);
        } else {
          is_different_list[key] = false;
          console.log(`[${key}]: No difference found`);
        }
        lottery_list[key] = new_list[key];
      }
    }
  }

  // console.log(is_different_list)
  return [ lottery_list, is_different_list ];
}

export default getFinalList;