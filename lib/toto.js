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
      drawNo = Number(item.querySelector('.drawNumber').textContent.trim().split(" ")[2])
      drawDate =  Date.parse(item.querySelector('.drawDate').textContent.trim())
      
      winning = [
        Number(item.querySelector('.win1').textContent.trim()),
        Number(item.querySelector('.win2').textContent.trim()),
        Number(item.querySelector('.win3').textContent.trim()),
        Number(item.querySelector('.win4').textContent.trim()),
        Number(item.querySelector('.win5').textContent.trim()),
        Number(item.querySelector('.win6').textContent.trim()),
      ]
      
      additional = Number(item.querySelector('.additional').textContent.trim())

      return {
        drawNo: drawNo,
        drawDate: drawDate,
        winning: winning,
        additional: additional,
      }
    })
  }).catch((error) => console.error(error))
  await page.close()
  console.log(`[TOTO] - scraped ${results.length} items`)
  return results
}
