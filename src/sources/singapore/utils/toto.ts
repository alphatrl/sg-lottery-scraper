import { Browser } from 'puppeteer';

import { TotoModel, TotoPrizeShareModel } from '../model';

/**
 * @param {import('puppeteer').Browser} browser
 * @returns Promise(list)
 *
 * Scrape Sweep results from Singapore Pools
 */
export default async function toto(browser: Browser): Promise<TotoModel[]> {
  const page = await browser.newPage();
  const response = await page
    .goto(
      'http://www.singaporepools.com.sg/en/product/Pages/toto_results.aspx',
      {
        waitUntil: 'networkidle0',
      }
    )
    .catch(async (error: Error) => {
      console.error('❌ Problem loading Toto page \n', error);
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
          Number(item.querySelector('.win1').textContent.trim()),
          Number(item.querySelector('.win2').textContent.trim()),
          Number(item.querySelector('.win3').textContent.trim()),
          Number(item.querySelector('.win4').textContent.trim()),
          Number(item.querySelector('.win5').textContent.trim()),
          Number(item.querySelector('.win6').textContent.trim()),
        ];

        const additional = Number(
          item.querySelector('.additional').textContent.trim()
        );

        // get winning shares information
        const winningShares: TotoPrizeShareModel[] = [];
        const parseWinningString = /[^\d\.]/g;
        const winningSharesNode = item.querySelector('.tableWinningShares');
        // remove element header and column title
        const winningSharesRows = [
          ...winningSharesNode.querySelectorAll('tr'),
        ].slice(2);

        for (const row of winningSharesRows) {
          const columns = [...row.querySelectorAll('td')];
          const groupName = columns[0].textContent.trim();
          const prizeAmt = columns[1].textContent
            .trim()
            .replace(parseWinningString, '');
          const count = columns[2].textContent
            .trim()
            .replace(parseWinningString, '');

          winningShares.push({
            group: groupName,
            prizeAmount: Number(prizeAmt) || 0,
            count: Number(count) || 0,
          });
        }

        return {
          drawNo: drawNo,
          drawDate: drawDate,
          winning: winning,
          additional: additional,
          winningShares: winningShares,
        };
      });
    })
    .catch((error: Error) => {
      console.error(error);
      return [];
    });

  if (results.length === 0) {
    console.error('❌ Problem loading TOTO page');
    console.error(
      'data:image/png;base64,' +
        (await page.screenshot({ encoding: 'base64', fullPage: true }))
    );
  }

  await page.close();
  console.log(`[TOTO] - scraped ${results.length} items`);
  return results;
}
