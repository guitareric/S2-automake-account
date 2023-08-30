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
    slowMo: 120,
  })
  const page = await browser.newPage()
  const navigationPromise = page.waitForNavigation()
  await page.setViewport({ width: 2712, height: 1249 })

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
      try {
        // Click on Nanofab Cleanroom
        await page.waitForSelector('div > div > div:nth-child(2) > div > .bp5-callout:nth-child(4)')
        await page.click('div > div > div:nth-child(2) > div > .bp5-callout:nth-child(4)')
        // Click on Supplies
        await page.waitForSelector('div > div:nth-child(16) > .bp5-button > .bp5-icon > svg')
        await page.click('div > div:nth-child(16) > .bp5-button > .bp5-icon > svg')
        // Click on Staff Only
        await page.waitForSelector('div:nth-child(1) > div > div:nth-child(2) > .bp5-button > .bp5-icon-caret-down > svg')
        await page.click('div:nth-child(1) > div > div:nth-child(2) > .bp5-button > .bp5-icon-caret-down > svg')
        // Click on Staff Only
        await page.waitForSelector('.bp5-collapse > .bp5-collapse-body > div > div > .bp5-callout:nth-child(2)')
        await page.click('.bp5-collapse > .bp5-collapse-body > div > div > .bp5-callout:nth-child(2)')
        // Navigate to new page and click on User
        await page.waitForSelector('.bp5-form-group:nth-child(1) > .bp5-form-content > div > .bp5-control-group > .bp5-popover-target:nth-child(3) > .bp5-button > .bp5-icon > svg')
        await page.click('.bp5-form-group:nth-child(1) > .bp5-form-content > div > .bp5-control-group > .bp5-popover-target:nth-child(3) > .bp5-button > .bp5-icon > svg')
        // Click on Search by Email
        await page.waitForSelector('.bp5-popover-content > .bp5-callout > .bp5-control-group > .bp5-html-select > select')
        await page.click('.bp5-popover-content > .bp5-callout > .bp5-control-group > .bp5-html-select > select')
        await page.select('.bp5-popover-content > .bp5-callout > .bp5-control-group > .bp5-html-select > select', 'email')
        // Type user email
        await page.waitForSelector(
          'body > div.bp5-portal > div > div.bp5-popover-transition-container.bp5-overlay-content.bp5-popover-appear-done.bp5-popover-enter-done > div > div.bp5-popover-content > div > div:nth-child(2) > div.bp5-input-group.bp5-fill > input'
        )
        await page.type(
          'body > div.bp5-portal > div > div.bp5-popover-transition-container.bp5-overlay-content.bp5-popover-appear-done.bp5-popover-enter-done > div > div.bp5-popover-content > div > div:nth-child(2) > div.bp5-input-group.bp5-fill > input',
          user['Email']
        )

        // Select email
        await page.waitForSelector('tbody > tr > td > .bp5-intent-primary > .bp5-button-text')
        await page.click('tbody > tr > td > .bp5-intent-primary > .bp5-button-text')
        // Select Charge Account
        await page.waitForSelector('tbody > tr > td > .bp5-button > .bp5-button-text')
        await page.click('tbody > tr > td > .bp5-button > .bp5-button-text')
        // Set New Member Fee to 01
        await page.waitForSelector('div:nth-child(4) > div > div > .bp5-input-group > .bp5-input')
        await page.type('div:nth-child(4) > div > div > .bp5-input-group > .bp5-input', '1')

        // Click Submit Button
        // await page.waitForSelector('#content > div:nth-child(2) > div > div > div:nth-child(6) > button.bp5-button.bp5-intent-success > span')
        // await page.click('#content > div:nth-child(2) > div > div > div:nth-child(6) > button.bp5-button.bp5-intent-success > span')

        console.log(user['First Name'] + ' ' + user['Last Name'] + ' charged successfully')
      } catch (e) {
        console.log(user['First Name'] + ' ' + user['Last Name'] + ' failed to find an account')
      }
    }
  }
  await browser.close()
}

module.exports = { NewMemberFee: NewMemberFee }
