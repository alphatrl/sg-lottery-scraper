/**
 * @param {import('puppeteer').Browser} browser
 * @param returns Promise(list)
 */

export default async function toto(browser) {
  const page = await browser.newPage()
  await page.goto("http://www.singaporepools.com.sg/en/product/Pages/toto_results.aspx")
  const results = await page.evaluate( () => {
    const items = [...document.querySelectorAll('.tables-wrap')]
    
    return items.map( (item) => {
      drawNo = item.querySelector('.drawNumber').textContent.trim().split(" ")[2]
      drawDate =  Date.parse(item.querySelector('.drawDate').textContent.trim())
      
      winning = [
        item.querySelector('.win1').textContent.trim(),
        item.querySelector('.win2').textContent.trim(),
        item.querySelector('.win3').textContent.trim(),
        item.querySelector('.win4').textContent.trim(),
        item.querySelector('.win5').textContent.trim(),
        item.querySelector('.win6').textContent.trim(),
      ]
      
      additional = item.querySelector('.additional').textContent.trim()

      return {
        drawNo: drawNo,
        drawDate: drawDate,
        winning: winning,
        additional: additional,
      }
    })
  })
  await page.close()
  console.log(`[TOTO] - scraped ${results.length} items`)
  return results
}
