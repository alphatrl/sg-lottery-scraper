import { Browser } from 'puppeteer';

import { SweepModel } from '../model';

/**
 * @param {import('puppeteer').Browser} browser
 * @returns Promise(list)
 *
 * Scrape Sweep results from Singapore Pools
 */
export default async function sweep(browser: Browser): Promise<SweepModel[]> {
  const page = await browser.newPage();
  const response = await page
    .goto(
      'http://www.singaporepools.com.sg/en/product/Pages/sweep_results.aspx',
      {
        waitUntil: 'networkidle0',
      }
    )
    .catch(async (error: Error) => {
      console.log('❌ Problem loading SWEEP page \n', error);
    });

  if (!response) {
    return [];
  }
  const results = await page
    .evaluate(() => {
      const items = [...document.querySelectorAll('.tables-wrap')];
      return items.map((item) => {
        const drawNo = Number(
          item.querySelector('.drawNumber').textContent.trim().split(' ')[2]
        );

        const rawDrawDate = item.querySelector('.drawDate').textContent.trim();
        const drawDate = Date.parse(`${rawDrawDate} GMT+0800`);

        const winning = [
          Number(item.querySelector('.valueFirstPrize').textContent.trim()),
          Number(item.querySelector('.valueSecondPrize').textContent.trim()),
          Number(item.querySelector('.valueThirdPrize').textContent.trim()),
        ];

        // get jackpot and lucky prizes
        // because they share the same class name 'tbodyJackpot'
        const jackpotLuckList = [];
        const jackpotLucky = item.querySelectorAll('.tbodyJackpot');
        for (let i = 0; i < jackpotLucky.length; i++) {
          const nodes = jackpotLucky[i].getElementsByTagName('td');
          const nodeList = [];
          for (let j = 0; j < nodes.length; j++) {
            nodeList.push(Number(nodes[j].textContent));
          }
          jackpotLuckList.push(nodeList);
        }
        const jackpot = jackpotLuckList[0];
        const lucky = jackpotLuckList[1];

        // get gift, consolation, participation, 2D
        // because they share the same class name 'expandable-content'
        const prizesList = [];
        const prizes = item.querySelectorAll('.expandable-content');
        for (let i = 0; i < prizes.length; i++) {
          const nodes = prizes[i].getElementsByTagName('td');
          const nodeList = [];
          for (let j = 0; j < nodes.length; j++) {
            nodeList.push(Number(nodes[j].textContent));
          }
          prizesList.push(nodeList);
        }

        const gift = prizesList[0];
        const consolation = prizesList[1];
        const participation = prizesList[2];
        const twoD = prizesList[3];

        return {
          drawNo: drawNo,
          drawDate: drawDate,
          winning: winning,
          jackpot: jackpot,
          lucky: lucky,
          gift: gift,
          consolation: consolation,
          participation: participation,
          twoD: twoD,
        };
      });
    })
    .catch((error: Error) => {
      console.error(error);
      return [];
    });

  if (results.length === 0) {
    console.error('❌ Problem loading SWEEP page');
    console.error(
      '❌ Problem loading SWEEP page' +
        'data:image/png;base64,' +
        (await page.screenshot({ encoding: 'base64', fullPage: true }))
    );
  }

  await page.close();
  console.log(`[SWEEP] - scraped ${results.length} items`);
  return results;
}
