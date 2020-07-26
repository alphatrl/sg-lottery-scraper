import puppeteer from 'puppeteer'
import fs from 'fs';
import path from 'path';
import {spawnSync} from 'child_process';

import MODULES from './modules.js';
import {default as verifyList} from './src/utils/compareList.js';
import {default as Firebase} from './src/utils/firebase.js';

const isProduction = process.env.NODE_ENV === 'production'
const firebase = new Firebase();
var all_differences_list = {}

if (!fs.existsSync('temp')) {
  fs.mkdirSync('temp')
}

if (fs.existsSync('sglottery')) {
  fs.unlinkSync('sglottery');
}

const main = async () => {

  const browser = await puppeteer.launch({
    headless: isProduction,
    args: isProduction ? ['--no-sandbox'] : [],
  })

  for (const module of MODULES) {
    const module_name = Object.keys(module);
    const filename = path.join('temp', `${module_name}.json`);
    var backup_list = {};
    
    if (fs.existsSync(filename)) {
      backup_list = JSON.parse(fs.readFileSync(filename, 'utf8'));
      fs.unlinkSync(filename)
    }

    // var [lottery_list, is_different_list] = await verifyList(await module(browser), old_list);
    var [lottery_list, is_different_list] = await module[module_name](browser).then(async (new_list) => {
      return await verifyList(new_list, backup_list);
    });

    all_differences_list = {... is_different_list};
    fs.writeFileSync(filename, JSON.stringify(lottery_list, null, isProduction ? 0 : 2)); 
  }
  
  await browser.close();

  // push json to github
  if (process.env.GITHUB_TOKEN) {
    spawnSync(
      'dpl',
      [
        '--provider=pages',
        '--committer-from-gh',
        `--github-token=${process.env.GITHUB_TOKEN}`,
        `--repo=${process.env.GITHUB_REPO}`,
        '--local-dir=temp',
      ],
      {
        stdio: 'inherit',
      }
    )
  }

  // settle firebase push notification
  isProduction ? await firebase.pushTopicWithList(all_differences_list) : await firebase.pushTestTopicWithList(all_differences_list);
  await firebase.exit();
  
  return null
}

// main thread
process.on('uncaughtException', function (err) {
  console.log(err);
})
main()