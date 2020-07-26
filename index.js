import puppeteer from 'puppeteer'
import fs from 'fs';
import path from 'path';
import {spawnSync} from 'child_process';

import MODULES from './modules.js';
import {default as getFinalList} from './src/utils/compareList.js';
import {default as getSGLottery} from './src/sources/sg_lottery/index.js';
import {default as Firebase} from './src/utils/firebase.js';

const isProduction = process.env.NODE_ENV === 'production'
const firebase = new Firebase();
var all_differences_list = {}

if (!fs.existsSync('temp')) {
  fs.mkdirSync('temp')
}

const main = async () => {

  const browser = await puppeteer.launch({
    headless: isProduction,
    args: isProduction ? ['--no-sandbox'] : [],
  })

  var old_list = {}

  const filename = path.join('temp', 'sg_lottery.json')
  if (fs.existsSync(filename)) {
    old_list = JSON.parse(fs.readFileSync(filename, 'utf8'));
    fs.unlinkSync(filename)
  }



  var [lottery_list, is_different_list] = await getFinalList(await getSGLottery(browser), old_list);
  all_differences_list = {... is_different_list};
  fs.writeFileSync(filename, JSON.stringify(lottery_list, null, isProduction ? 0 : 2));
  
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
  await firebase.pushTestTopicWithList(all_differences_list)
  await firebase.exit();
  
  return null
}

// main thread
process.on('uncaughtException', function (err) {
  console.log(err);
})
main()