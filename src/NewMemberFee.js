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

  // Charge new member fee

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

      await page.waitForSelector('div > div:nth-child(16) > .bp4-button > .bp4-icon > svg')
      await page.click('div > div:nth-child(16) > .bp4-button > .bp4-icon > svg')

      await page.waitForSelector('div:nth-child(1) > div > div:nth-child(2) > .bp4-button > .bp4-icon-caret-down > svg')
      await page.click('div:nth-child(1) > div > div:nth-child(2) > .bp4-button > .bp4-icon-caret-down > svg')

      await page.waitForSelector(
        '#content > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(16) > div > div > div > div > div:nth-child(2) > div > div > div > div > div:nth-child(2) > span'
      )
      await page.click('#content > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(16) > div > div > div > div > div:nth-child(2) > div > div > div > div > div:nth-child(2) > span')

      await page.waitForSelector('#content > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div > div > span:nth-child(3) > button > span > svg')
      await page.click('#content > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div > div > span:nth-child(3) > button > span > svg')

      await page.waitForSelector(
        'body > div.bp4-portal > div > div.bp4-popover2-transition-container.bp4-overlay-content.bp4-popover2-appear-done.bp4-popover2-enter-done > div > div.bp4-popover2-content > div > div:nth-child(2) > div.bp4-input-group.bp4-fill > input'
      )
      await page.click(
        'body > div.bp4-portal > div > div.bp4-popover2-transition-container.bp4-overlay-content.bp4-popover2-appear-done.bp4-popover2-enter-done > div > div.bp4-popover2-content > div > div:nth-child(2) > div.bp4-input-group.bp4-fill > input'
      )

      await page.type(
        'body > div.bp4-portal > div > div.bp4-popover2-transition-container.bp4-overlay-content.bp4-popover2-appear-done.bp4-popover2-enter-done > div > div.bp4-popover2-content > div > div:nth-child(2) > div.bp4-input-group.bp4-fill > input',
        user['First Name'] + ' ' + user['Last Name']
      )

      await page.waitForSelector(
        'body > div.bp4-portal > div > div.bp4-popover2-transition-container.bp4-overlay-content.bp4-popover2-enter-done > div > div.bp4-popover2-content > div > div:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(1) > button > span'
      )
      await page.click(
        'body > div.bp4-portal > div > div.bp4-popover2-transition-container.bp4-overlay-content.bp4-popover2-enter-done > div > div.bp4-popover2-content > div > div:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(1) > button > span'
      )

      await page.waitForSelector(
        'body > div:nth-child(12) > div > div.bp4-popover2-transition-container.bp4-overlay-content.bp4-popover2-appear-done.bp4-popover2-enter-done > div > div.bp4-popover2-content > div > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > button > span'
      )
      await page.click(
        'body > div:nth-child(12) > div > div.bp4-popover2-transition-container.bp4-overlay-content.bp4-popover2-appear-done.bp4-popover2-enter-done > div > div.bp4-popover2-content > div > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > button > span'
      )

      await page.type('#content > div:nth-child(2) > div > div > div:nth-child(4) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div.bp4-input-group > input', '1')
      // press submit button
      await page.waitForSelector('#content > div:nth-child(2) > div > div > div:nth-child(6) > button.bp4-button.bp4-intent-success')
      await page.click('#content > div:nth-child(2) > div > div > div:nth-child(6) > button.bp4-button.bp4-intent-success')

      // end loop
    }
  }
  await browser.close()
}

module.exports = { NewMemberFee: NewMemberFee }
