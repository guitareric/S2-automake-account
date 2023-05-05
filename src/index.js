const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))
const csv = require('csvtojson') // Make sure you have this line in order to call functions from this modules
;(async () => {
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
    args: ['--window-size=1400,900', '--disable-gpu', '--disable-features=IsolateOrigins,site-per-process', '--blink-settings=imagesEnabled=true'],
  })
  const page = await browser.newPage()
  await page.goto('https://155.98.92.189/frameset/')
  console.log('Logging in...')
  await page.waitForSelector('#username')
  await page.type('#username', 'ericf')
  await page.type('#password', 'Amelia_jane1')
  await page.keyboard.press('Enter')
  console.log('login successful')
  await page.waitForTimeout(1000)

  // begin loop and initialize variables
  let elementHandle
  let frame
  for (const user of users) {
    elementHandle = await page.waitForSelector('#mainFrame')
    frame = await elementHandle.contentFrame()
    await page.waitForTimeout(1000)
    await frame.waitForSelector('#topbaradmin')
    await frame.click('#topbaradmin')
    await frame.waitForSelector('#PplAdd')
    await frame.click('#PplAdd')
    await page.waitForTimeout(5000)
    elementHandle = await frame.waitForSelector('#innerPageFrame')
    frame = await elementHandle.contentFrame()
    await frame.waitForSelector('#lastname')
    await frame.click('#lastname')
    await frame.type('#lastname', user.lastName)
    await frame.type('#firstname', user.firstName)
    console.log('first name added')
    await frame.waitForSelector('#expirationdate_date')
    await frame.type('#expirationdate_date', '10/1/2024 00:00', { delay: 100 })
    console.log('expiration date added')
    await frame.click('#tab-credentialtab')
    await frame.waitForSelector('#addcredential')
    await frame.click('#addcredential')
    await frame.waitForSelector('#encodednumber0')
    await frame.type('#encodednumber0', user.prox)
    await frame.click('#tab-accesstab')
    console.log('access tab clicked')
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
    // Studen Lab Access
    // await frame.waitForSelector('#\\36 1 > td:nth-child(3)')
    // await frame.click('#\\36 1 > td:nth-child(3)')
    // await frame.waitForSelector('#\\37 7 > td:nth-child(3)')
    // await frame.click('#\\37 7 > td:nth-child(3)')
    await page.waitForTimeout(300)
    await frame.click('#uparrow')
    await page.waitForTimeout(500)
    console.log('about to click save')
    await page.waitForTimeout(500)
    await frame.click('#save')
    await page.waitForTimeout(3000)
    console.log('member added successfully')
  }
  // end loop

  await browser.close()
  console.log('all members added successfully')
})()

// node index --disable-web-security, ----disable-features=IsolateOrigins,site-per-process
