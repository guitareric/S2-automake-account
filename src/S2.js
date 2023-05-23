const puppeteer = require('puppeteer-extra')
const csv = require('csvtojson') // Make sure you have this line in order to call functions from this modules
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, 'process.env') })

async function S2() {
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
    args: ['--window-size=800,600', '--disable-gpu', '--disable-features=IsolateOrigins,site-per-process', '--blink-settings=imagesEnabled=true'],
  })
  const page = await browser.newPage()
  const navigationPromise = page.waitForNavigation()
  const yOffset = -17

  // Make S2 account

  await page.goto('https://155.98.92.189/frameset/')
  console.log('Logging in...')
  await page.waitForSelector('#username')
  await page.type('#username', process.env.S2_USERNAME)
  await page.type('#password', process.env.S2_PASSWORD)
  await page.keyboard.press('Enter')
  console.log('login successful')
  await page.waitForTimeout(6000)

  // begin loop and initialize variables
  var elementHandle = await page.waitForSelector('#mainFrame')
  var frame = await elementHandle.contentFrame()
  elementHandle = await frame.waitForSelector('#innerPageFrame')
  frame = await elementHandle.contentFrame()
  await page.waitForTimeout(3000)

  for (const user of users) {
    if (!user['Badge Printed and S2 Set']) {
      // check to see if student to member
      // Student Lab Access
      if (user['Member Type'] === 'Student Lab to New Member') {
        // click admin
        await page.mouse.click(90, 17, { button: 'left' })
        await page.waitForTimeout(1000)
        // click pplsearch
        await page.mouse.click(142, 304, { button: 'left' })
        await page.waitForTimeout(2000)
        // get page focus
        await page.mouse.click(566, 116, { button: 'left' })
        await page.waitForTimeout(1000)
        // scroll down
        await page.mouse.wheel({ deltaY: 200 })
        console.log('scrolling')
        await page.waitForTimeout(1000)
        // click Last Name field
        await page.mouse.click(692, 352 + yOffset, { button: 'left' })
        await page.waitForTimeout(1000)
        await page.keyboard.type(user['Last Name'])
        // scroll right
        await page.mouse.wheel({ deltaX: 300 })
        await page.mouse.click(692, 352 + yOffset, { button: 'left' })
        await page.waitForTimeout(1000)
        await page.keyboard.type(user['First Name'])
        // click search
        await page.keyboard.press('Enter')
        await page.waitForTimeout(2000)
        // click on user
        await page.mouse.click(283, 210 + yOffset, { button: 'left' })
        await page.waitForTimeout(2000)
        // delete user
        await frame.waitForSelector('#delete')
        await frame.click('#delete')
        await page.waitForTimeout(2000)
        // click confirm
        await page.mouse.click(645, 109 + yOffset, { button: 'left' })
        await page.waitForTimeout(1000)
        console.log('student deleted')
      }
      await page.goto('https://155.98.92.189/frameset/')
      await page.waitForTimeout(2000)
      elementHandle = await page.waitForSelector('#mainFrame')
      frame = await elementHandle.contentFrame()
      await frame.waitForSelector('#topbaradmin')
      await frame.click('#topbaradmin')
      await frame.waitForSelector('#PplAdd')
      await frame.click('#PplAdd')
      await page.waitForTimeout(2000)
      elementHandle = await frame.waitForSelector('#innerPageFrame')
      await page.waitForTimeout(1000)
      frame = await elementHandle.contentFrame()
      await page.waitForTimeout(1000)
      await frame.waitForSelector('#lastname')
      await frame.type('#lastname', user['Last Name'])
      await frame.type('#firstname', user['First Name'])
      console.log('first name added')
      await frame.waitForSelector('#expirationdate_date')
      await frame.type('#expirationdate_date', '10/1/2024 00:00', { delay: 100 })
      await page.keyboard.press('Enter')
      await page.waitForTimeout(1000)
      console.log('expiration date added')
      await frame.click('#tab-credentialtab')
      await frame.waitForSelector('#addcredential')
      await frame.click('#addcredential')
      await frame.waitForSelector('#encodednumber0')
      await frame.type('#encodednumber0', user['Prox Code'])
      await frame.click('#tab-accesstab')
      console.log('access tab clicked')

      // New Member/PI access levels
      if (user['Member Type'] === 'New Member' || user['Member Type'] === 'PI') {
        // backend lab
        await frame.waitForSelector('#\\35 9 > td:nth-child(3)')
        await frame.click('#\\35 9 > td:nth-child(3)')
        // clean conference room
        await frame.waitForSelector('#\\36 2 > td:nth-child(3)')
        await frame.click('#\\36 2 > td:nth-child(3)')
        // cleanroom day only
        await frame.waitForSelector('#\\36 4 > td:nth-child(3)')
        await frame.click('#\\36 4 > td:nth-child(3)')
        // cleanroom exit
        await frame.waitForSelector('#\\37 7 > td:nth-child(3)')
        await frame.click('#\\37 7 > td:nth-child(3)')
        // prototyping lab
        await frame.waitForSelector('#\\37 0 > td:nth-child(3)')
        await frame.click('#\\37 0 > td:nth-child(3)')
      }

      // Student Lab Access
      if (user['Member Type'] === 'Student Lab') {
        await frame.waitForSelector('#\\36 1 > td:nth-child(3)')
        await frame.click('#\\36 1 > td:nth-child(3)')
        await frame.waitForSelector('#\\37 7 > td:nth-child(3)')
        await frame.click('#\\37 7 > td:nth-child(3)')
      }

      // Staff Lab Access
      if (user['Member Type'] === 'Student Lab') {
        await frame.waitForSelector('#\\36 1 > td:nth-child(3)')
        await frame.click('#\\36 1 > td:nth-child(3)')
        await frame.waitForSelector('#\\37 7 > td:nth-child(3)')
        await frame.click('#\\37 7 > td:nth-child(3)')
      }

      await page.waitForTimeout(300)
      await frame.click('#uparrow')
      await page.waitForTimeout(500)
      console.log('about to click save')
      await page.waitForTimeout(500)
      await frame.click('#save')
      await page.waitForTimeout(3000)
      console.log('member added successfully')
    }
  }
  await browser.close()
}

module.exports = { S2: S2 }
