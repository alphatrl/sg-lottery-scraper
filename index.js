import puppeteer from 'puppeteer'

import fs from 'fs'
import path from 'path'
import  { spawnSync } from 'child_process'

import fourD from './lib/fourD.js'
import toto from './lib/toto.js'
import sweep from './lib/sweep.js'


const isProduction = process.env.NODE_ENV === 'production'

if (!fs.existsSync('temp')) {
  fs.mkdirSync('temp')
}

const main = async () => {

  const filename = path.join('temp', 'sglottery.json')
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename)
  }
  
  const browser = await puppeteer.launch({
    headless: isProduction,
    args: isProduction ? ['--no-sandbox'] : [],
  })

  var results =  [ fourD(browser), toto(browser), sweep(browser) ]
  
  var sgLottery = await Promise.all(results)
    .then((values) => {
      return {
        FourD: values[0],
        Toto: values[1],
        Sweep: values[2]
      }
    })
    .catch((error) => console.error(error))

  fs.writeFileSync(filename, JSON.stringify(sgLottery, null, isProduction ? 0 : 2))

  await browser.close()

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