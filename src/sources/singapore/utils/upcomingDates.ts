import { Browser } from 'puppeteer';

import { SingaporeUpcomingDatesModel } from '../model';

/**
 * @param {import('puppeteer').Browser} browser
 * @returns Promise(list)
 *
 * Scrape upcoming lottery dates [4D, Toto, Sweep] from Singapore Pools
 */

export default async function upcomingDates(
  browser: Browser
): Promise<SingaporeUpcomingDatesModel> {
  const page = await browser.newPage();
  const response = await page
    .goto('https://online.singaporepools.com/en/lottery', {
      waitUntil: 'networkidle0',
    })
    .catch(async (error: Error) => {
      console.error('❌ Problem loading Singapore Pools Home Page \n', error);
    });

  if (!response) {
    throw '[Singapore]: Unable to get response from upcomingDates';
  }

  await page.waitForSelector('.strong');

  const dates = await page.evaluate(() => {
    const elements = [...document?.querySelectorAll('.sppl-panel')];

    const results = elements.map((htmlElement) => {
      const dateString = htmlElement
        .querySelector('[class~="strong"]')
        .nextElementSibling.textContent.trim();

      // remove the ', ' from "Sat, 18 Dec 2021, 6.30pm"
      const dateArray = dateString.split(', ');
      return Date.parse(`${dateArray[1]} 18:30:00 GMT+0800`);
    });

    return results;
  });

  await page.close();
  return {
    FourD: dates[0],
    Toto: dates[1],
    Sweep: dates[2],
  };
}
