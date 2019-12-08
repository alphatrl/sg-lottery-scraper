/**
 * @param {import('puppeteer').Browser} browser
 * @param returns Promise(list)
 */

export default async function fourD(browser) {
  const page = await browser.newPage()
  await page.goto("http://www.singaporepools.com.sg/en/product/Pages/4d_results.aspx")
  const results = await page.evaluate( () => {
    const items = [...document.querySelectorAll('.tables-wrap')]
    
    return items.map( (item) => {
      drawNo = item.querySelector('.drawNumber').textContent.trim().split(" ")[2]
      drawDate =  Date.parse(item.querySelector('.drawDate').textContent.trim())
      
      winning = [
          item.querySelector('.tdFirstPrize').textContent.trim(),
          item.querySelector('.tdSecondPrize').textContent.trim(),
          item.querySelector('.tdThirdPrize').textContent.trim()
      ]
      
      starterNode = item.querySelector('.tbodyStarterPrizes').getElementsByTagName('td')
      starter = []
      for (let index = 0; index < starterNode.length; index++) {
        starter.push(starterNode[index].textContent)
      }

      consolationNode = item.querySelector('.tbodyConsolationPrizes').getElementsByTagName('td')
      consolation = []
      for (let index = 0; index < consolationNode.length; index++) {
        consolation.push(consolationNode[index].textContent)
      }

      return {
        drawNo: drawNo,
        drawDate: drawDate,
        winning: winning,
        starter: starter,
        consolation: consolation
      }
    })
  })
  await page.close()
  console.log(`[4D] - scraped ${results.length} items`)
  return results
}
