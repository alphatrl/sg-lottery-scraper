/**
 * @param {import('puppeteer').Browser} browser
 * @param returns Promise(list)
 */

export default async function sweep(browser) {
  const page = await browser.newPage()
  await page.goto("http://www.singaporepools.com.sg/en/product/Pages/sweep_results.aspx")
  const results = await page.evaluate( () => {
    const items = [...document.querySelectorAll('.tables-wrap')]
    
    return items.map( (item) => {
      const drawNo = Number(item.querySelector('.drawNumber').textContent.trim().split(" ")[2])
      const drawDate =  Date.parse(item.querySelector('.drawDate').textContent.trim())
      
      const winning = [
        Number(item.querySelector('.valueFirstPrize').textContent.trim()),
        Number(item.querySelector('.valueSecondPrize').textContent.trim()),
        Number(item.querySelector('.valueThirdPrize').textContent.trim())
      ]
      
      // get jackpot and lucky prizes
      // because they share the same class name 'tbodyJackpot'
      const jackpotLuckList = []
      const jackpotLucky = item.querySelectorAll('.tbodyJackpot')
      for (let i = 0; i < jackpotLucky.length; i ++) {
        let nodes = jackpotLucky[i].getElementsByTagName('td')
        let nodeList = []
        for (let j = 0; j < nodes.length; j ++) {
          nodeList.push(Number(nodes[j].textContent))
        }
        jackpotLuckList.push(nodeList)
      }
      const jackpot = jackpotLuckList[0]
      const lucky = jackpotLuckList[1]

      // get gift, consolation, participation, 2D
      // because they share the same class name 'expandable-content'
      const prizesList = []
      const prizes = item.querySelectorAll('.expandable-content')
      for (let i = 0; i < prizes.length; i++) {
        let nodes = prizes[i].getElementsByTagName('td')
        let nodeList = []
        for (let j = 0; j < nodes.length; j ++) {
          nodeList.push(Number(nodes[j].textContent))
        }
        prizesList.push(nodeList)
      }

      const gift = prizesList[0]
      const consolation = prizesList[1]
      const participation = prizesList[2]
      const twoD = prizesList[3]

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
      }
    })
  }).catch((error) => console.error(error))
  await page.close()
  console.log(`[SWEEP] - scraped ${results.length} items`)
  return results
}
