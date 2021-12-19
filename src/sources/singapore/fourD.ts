import { Browser } from 'puppeteer';

import { FourDModel } from './model';

/**
 * @param {import('puppeteer').Browser} browser
 * @returns Promise(list)
 *
 * Scrape 4D results from Singapore Pools
 */
export default async function fourD(browser: Browser): Promise<FourDModel[]> {
  const page = await browser.newPage();
  const response = await page
    .goto('http://www.singaporepools.com.sg/en/product/Pages/4d_results.aspx', {
      waitUntil: 'networkidle0',
    })
    .catch(async (error: Error) => {
      console.error('[ERROR]: Problem loading 4D page \n', error);
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
          Number(item.querySelector('.tdFirstPrize').textContent.trim()),
          Number(item.querySelector('.tdSecondPrize').textContent.trim()),
          Number(item.querySelector('.tdThirdPrize').textContent.trim()),
        ];

        const starterNode = item
          .querySelector('.tbodyStarterPrizes')
          .getElementsByTagName('td');
        const starter = [];
        for (let index = 0; index < starterNode.length; index++) {
          starter.push(Number(starterNode[index].textContent));
        }

        const consolationNode = item
          .querySelector('.tbodyConsolationPrizes')
          .getElementsByTagName('td');
        const consolation = [];
        for (let index = 0; index < consolationNode.length; index++) {
          consolation.push(Number(consolationNode[index].textContent));
        }

        return {
          drawNo: drawNo,
          drawDate: drawDate,
          winning: winning,
          starter: starter,
          consolation: consolation,
        };
      });
    })
    .catch((error: Error) => {
      console.error(error);
      return [];
    });

  if (results.length === 0) {
    console.error('[ERROR]: Problem loading 4D page');
    console.error(
      'data:image/png;base64,' +
        (await page.screenshot({ encoding: 'base64', fullPage: true }))
    );
  }

  await page.close();

  console.log(`[4D] - scraped ${results.length} items`);
  return results;
}
