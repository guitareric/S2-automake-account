const puppeteer = require('puppeteer-extra')
const csv = require('csvtojson')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, 'process.env') })

async function NewMemberFee() {
  const csvFilePath = 'students.csv' // Resource.csv in your case
  const users = await csv()
    .fromFile(csvFilePath)
    .then(jsonObj => {
      return jsonObj
    })

  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    slowMo: 40,
  })
  const page = await browser.newPage()
  const navigationPromise = page.waitForNavigation()

  await page.goto('https://resource.cores.utah.edu/auth/login')

  await page.waitForSelector('#form-group-input')
  await page.type('input[name="username"]', process.env.HSC_USERNAME)

  await page.waitForSelector('#form-group-input')
  await page.type('input[name="password"]', process.env.HSC_PASSWORD)

  await page.waitForSelector('#content > form > div:nth-child(3) > button')
  await page.click('#content > form > div:nth-child(3) > button')

  await navigationPromise

  for (const user of users) {
    if (!user['Badge Printed and S2 Set']) {
      await page.goto('https://resource.cores.utah.edu/#/group/13')
      await page.waitForSelector('div > div > div:nth-child(2) > div > .bp4-callout:nth-child(4)')
      await page.click('div > div > div:nth-child(2) > div > .bp4-callout:nth-child(4)')

      await page.waitForSelector('div > div > div:nth-child(16) > .bp4-button > .bp4-button-text')
      await page.click('div > div > div:nth-child(16) > .bp4-button > .bp4-button-text')

      await page.waitForSelector('div:nth-child(1) > div > div:nth-child(2) > .bp4-button > .bp4-button-text')
      await page.click('div:nth-child(1) > div > div:nth-child(2) > .bp4-button > .bp4-button-text')

      await page.waitForSelector('.bp4-collapse > .bp4-collapse-body > div > div > .bp4-callout:nth-child(2)')
      await page.click('.bp4-collapse > .bp4-collapse-body > div > div > .bp4-callout:nth-child(2)')

      await page.waitForSelector('.bp4-form-group:nth-child(1) > .bp4-form-content > div > .bp4-control-group > .bp4-popover2-target:nth-child(3) > .bp4-button > .bp4-icon > svg > path')
      await page.click('.bp4-form-group:nth-child(1) > .bp4-form-content > div > .bp4-control-group > .bp4-popover2-target:nth-child(3) > .bp4-button > .bp4-icon > svg > path')

      await page.waitForSelector('.bp4-popover2-content > .bp4-callout > .bp4-control-group > .bp4-html-select > select')
      await page.click('.bp4-popover2-content > .bp4-callout > .bp4-control-group > .bp4-html-select > select')

      await page.select('.bp4-popover2-content > .bp4-callout > .bp4-control-group > .bp4-html-select > select', 'email')

      await page.waitForSelector('.bp4-popover2-content > .bp4-callout > .bp4-control-group > .bp4-html-select > select')
      await page.click('.bp4-popover2-content > .bp4-callout > .bp4-control-group > .bp4-html-select > select')

      await page.waitForSelector('.bp4-popover2-content > .bp4-callout > .bp4-control-group > .bp4-input-group > .bp4-input')
      await page.type('.bp4-popover2-content > .bp4-callout > .bp4-control-group > .bp4-input-group > .bp4-input', user['Email'])

      await page.waitForSelector(
        'body > div:nth-child(11) > div > div.bp4-popover2-transition-container.bp4-overlay-content.bp4-popover2-enter-done > div > div.bp4-popover2-content > div > div:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(1) > button > span'
      )
      await page.click(
        'body > div:nth-child(11) > div > div.bp4-popover2-transition-container.bp4-overlay-content.bp4-popover2-enter-done > div > div.bp4-popover2-content > div > div:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(1) > button > span'
      )

      try {
        await page.waitForSelector(
          'body > div:nth-child(12) > div > div.bp4-popover2-transition-container.bp4-overlay-content.bp4-popover2-enter-done > div > div.bp4-popover2-content > div > div:nth-child(2) > table > tbody > tr > td:nth-child(1) > button > span',
          { timeout: 3000 }
        )
        await page.click(
          'body > div:nth-child(12) > div > div.bp4-popover2-transition-container.bp4-overlay-content.bp4-popover2-enter-done > div > div.bp4-popover2-content > div > div:nth-child(2) > table > tbody > tr > td:nth-child(1) > button > span'
        )
        await page.waitForSelector('div:nth-child(4) > div > div > .bp4-input-group > .bp4-input')
        await page.type('div:nth-child(4) > div > div > .bp4-input-group > .bp4-input', '1')

        // press submit button
        // await page.waitForSelector('#content > div:nth-child(2) > div > div > div:nth-child(6) > button.bp4-button.bp4-intent-success')
        // await page.click('#content > div:nth-child(2) > div > div > div:nth-child(6) > button.bp4-button.bp4-intent-success')

        console.log(user['First Name'] + ' ' + user['Last Name'] + ' charged successfully')
      } catch (e) {
        console.log(user['First Name'] + ' ' + user['Last Name'] + ' failed to find an account')
      }
    }
  }
  await browser.close()
}

module.exports = { NewMemberFee: NewMemberFee }
