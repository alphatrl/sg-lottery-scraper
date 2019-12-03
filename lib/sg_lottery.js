var {Builder, By} = require("selenium-webdriver")

function FourD(date, drawNo, topThree, starter, consolation) {
  this.date = date
  this.drawNo = drawNo
  this.topThree = topThree
  this.starter = starter
  this.consolation = consolation
}

function Toto(date, drawNo, winning, additional) {
  this.date = date
  this.drawNo = drawNo
  this.winning = winning
  this.additional = additional
}

function Sweep(date, drawNo, topThree, jackpot, lucky, gift, consolation, participation, twoD) {
  this.date = date
  this.drawNo = drawNo
  this.topThree = topThree
  this.jackpot = jackpot
  this.lucky = lucky
  this.gift = gift
  this.consolation = consolation
  this.participation = participation
  this.twoD = twoD
}

module.exports = {

  // return 3 fourD results
  getFourD: async function() {
    fourDList = []

    var driver = await new Builder().forBrowser('chrome').build()
    await driver.manage().setTimeouts({implicit: 10000})// implicit wait: 10 seconds
    await driver.manage().window().setRect({width: 1200, height: 600}) // browser will display 3 tables
    await driver.get("http://www.singaporepools.com.sg/en/product/Pages/4d_results.aspx")

    await driver.findElements(By.className("tables-wrap"))
      .then(async (tables) => {
        // loop through contents
        for (const result of tables) {
          // only get the first 3 tables displayed
          if (await result.isDisplayed()){

            // Get drawNo
            var drawString = await result.findElement(By.className("drawNumber")).getText()
            drawNo = parseInt(drawString.split(" ")[2])

            // Get date in milliseconds
            var date = Date.parse(await result.findElement(By.className('drawDate')).getText())

            // Get top3 prize numbers
            var topThree = [
              parseInt(await result.findElement(By.className("tdFirstPrize")).getText()),
              parseInt(await result.findElement(By.className("tdSecondPrize")).getText()),
              parseInt(await result.findElement(By.className("tdThirdPrize")).getText())
            ]

            // Get Starter Prize
            starterPrizes = []
            starterTable = await result.findElement(By.className("tbodyStarterPrizes"))
            elements = await starterTable.findElements(By.css("td"))
            for (const cell of elements) {
              starterPrizes.push(parseInt(await cell.getText()))
            }

            // Get Consolation Prize
            consolationPrizes = []
            consolationTable = await result.findElement(By.className("tbodyConsolationPrizes"))
            elements = await consolationTable.findElements(By.css("td"))
            for (const cell of elements) {
              consolationPrizes.push(parseInt(await cell.getText()))
            }
            fourDList.push(new FourD(date, drawNo, topThree, starterPrizes, consolationPrizes))
          }
        }
      }).catch(async (error) => {
        console.log("Unable to scrape 4D")
        console.error(error)
      }).finally(() => driver.quit())
    return fourDList
  },

  // returns recent 3 toto results in a list
  getToto: async function() {
    totoList = []
    count = 0

    var driver = await new Builder().forBrowser('chrome').build()
    await driver.manage().setTimeouts({implicit: 10000})// implicit wait: 10 seconds
    await driver.manage().window().setRect({width: 1200, height: 600}) // browser will display 2 tables
    await driver.get("http://www.singaporepools.com.sg/en/product/Pages/toto_results.aspx")

    await driver.findElements(By.className("tables-wrap"))
      .then(async (tables) => {
        // loop through 3 contents
        while (count < 3) {
          result = tables[count]

          // Get drawNo
          var drawString = await result.findElement(By.className("drawNumber")).getText()
          drawNo = parseInt(drawString.split(" ")[2])

          // Get date in milliseconds
          var date = Date.parse(await result.findElement(By.className('drawDate')).getText())

          // Get winning numbers 
          winning = [
            parseInt(await result.findElement(By.className("win1")).getText()),
            parseInt(await result.findElement(By.className("win2")).getText()),
            parseInt(await result.findElement(By.className("win3")).getText()),
            parseInt(await result.findElement(By.className("win4")).getText()),
            parseInt(await result.findElement(By.className("win5")).getText()),
            parseInt(await result.findElement(By.className("win6")).getText()),
          ]

          // Get Additional Number
          additional = parseInt(await result.findElement(By.className("additional")).getText())

          totoList.push(new Toto(date, drawNo, winning, additional))

          count ++

          // click the next page button 
          // after scraping the first two tables data 
          if (count % 2 == 0) {
            executeJS = "document.getElementsByClassName('next')[0].click()"
            await driver.executeScript(executeJS)
            await driver.sleep(1000) // pause for 1 sec to finish animation
          }
        }
      }).catch(async function(error) {
        console.log("Unable to scrape Toto")
        console.error(error)
      }).finally( async () => { await driver.quit()} )

      return totoList
  },

  // return recent 1 sweep result in a list
  getSweep: async function() {
    sweepList = []

    var driver = await new Builder().forBrowser('chrome').build()
    await driver.manage().setTimeouts({implicit: 10000})// implicit wait: 10 seconds
    await driver.manage().window().setRect({width: 1200, height: 600}) // browser will display 3 tables
    await driver.get("http://www.singaporepools.com.sg/en/product/Pages/sweep_results.aspx")

    await driver.findElements(By.className("tables-wrap"))
      .then(async (tables) => {
        for (const result of tables) {
          // only display 1st table
          if (await result.isDisplayed()){
    
            // open dropdown table
            executeJS1 = "document.getElementsByClassName('swpr-toggle-expand')[0].click()"
            executeJS2 = "document.getElementsByClassName('swpr-toggle-expand')[1].click()"
            executeJS3 = "document.getElementsByClassName('swpr-toggle-expand')[2].click()"
            executeJS4 = "document.getElementsByClassName('swpr-toggle-expand')[3].click()"
            await driver.executeScript(executeJS1)
            await driver.executeScript(executeJS2)
            await driver.executeScript(executeJS3)
            await driver.executeScript(executeJS4)
    
            // Get drawNo
            var drawString = await result.findElement(By.className("drawNumber")).getText()
            drawNo = parseInt(drawString.split(" ")[2])
    
            // Get date in milliseconds
            var date = Date.parse(await result.findElement(By.className('drawDate')).getText())
    
            // Get top3 prize numbers
            var topThree = [
              parseInt(await result.findElement(By.className("valueFirstPrize")).getText()),
              parseInt(await result.findElement(By.className("valueSecondPrize")).getText()),
              parseInt(await result.findElement(By.className("valueThirdPrize")).getText())
            ]
    
            // Get jackpot and lucky prizes
            var lucky10 = []
            luckyPrizes = await result.findElements(By.className("tbodyJackpot"))
            for (const prizes of luckyPrizes) {
              winList = []
              await prizes.findElements(By.css("td"))
                .then(async (elements) => {
                  for (const data of elements) {
                    winList.push(parseInt(await data.getText()))
                  }
                })
              lucky10.push(winList)
            }
    
          // Get Gift, Consolation, Participation, 2D
          var smallWins = []
          smallPrizes = await result.findElements(By.className("expandable-content"))
          for (const prizes of smallPrizes) {
            winList = []
            await prizes.findElements(By.css("td"))
              .then(async (elements) => {
                for (const data of elements) {
                  winList.push(parseInt(await data.getText()))
                }
              })
            smallWins.push(winList)
          }
    
            sweepList.push(new Sweep(date, drawNo, topThree, lucky10[0], lucky10[1],
              smallWins[0], smallWins[1], smallWins[2], smallWins[3]))
    
          }
        }
      }).catch(async (error) => {
        console.log("Unable to scrape Sweep")
        console.error(error)
      }).finally(()=>driver.quit())
    return sweepList
  }

}