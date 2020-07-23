import puppeteer from 'puppeteer'

import fs from 'fs'
import path from 'path'
import  { spawnSync } from 'child_process'

import getLottery from './lib/getLottery.js';
import getLotteryTest from './lib/getLotteryTest.js';


const isProduction = process.env.NODE_ENV === 'production'

if (!fs.existsSync('temp')) {
  fs.mkdirSync('temp')
}

const main = async () => {

  var oldList = {}

  const filename = path.join('temp', 'sglottery.json')
  if (fs.existsSync(filename)) {
    oldList = JSON.parse(fs.readFileSync(filename, 'utf8'));
    fs.unlinkSync(filename)
  }

  const browser = await puppeteer.launch({
    headless: isProduction,
    args: isProduction ? ['--no-sandbox'] : [],
  })
  
  var sgLottery = isProduction ? await getLottery(browser, oldList) : await getLotteryTest(browser, oldList);

  fs.writeFileSync(filename, JSON.stringify(sgLottery, null, isProduction ? 0 : 2));

  await browser.close();

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

  return null
}

// main thread
process.on('uncaughtException', function (err) {
  console.log(err);
})
main()