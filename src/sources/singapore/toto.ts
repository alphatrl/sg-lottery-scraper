import { Browser } from 'puppeteer';

/**
 * @param {import('puppeteer').Browser} browser
 * @returns Promise(list)
 *
 * Scrape Sweep results from Singapore Pools
 */
export default async function toto(
  browser: Browser
): Promise<Record<string, unknown>[] | []> {
  const page = await browser.newPage();
  const response = await page
    .goto(
      'http://www.singaporepools.com.sg/en/product/Pages/toto_results.aspx',
      {
        waitUntil: 'networkidle0',
      }
    )
    .catch(async (error: Error) => {
      console.error('[ERROR]: Problem loading Toto page \n', error);
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
        const drawDate = Date.parse(
          item.querySelector('.drawDate').textContent.trim()
        );

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

        return {
          drawNo: drawNo,
          drawDate: drawDate,
          winning: winning,
          additional: additional,
        };
      });
    })
    .catch((error: Error) => {
      console.error(error);
      return [];
    });

  if (results.length === 0) {
    console.error('[ERROR]: Problem loading TOTO page');
    console.error(
      'data:image/png;base64,' +
        (await page.screenshot({ encoding: 'base64', fullPage: true }))
    );
  }

  await page.close();
  console.log(`[TOTO] - scraped ${results.length} items`);
  return results;
}
