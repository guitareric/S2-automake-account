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
  const navigationPromise = page.waitForNavigation()

  // Make S2 account

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

    // check to see if student to member
    // Student Lab Access
    if (user['Member Type'] === 'Student Lab to New Member') {
      // delete student
      console.log('deleting student')
      await frame.waitForSelector('#topbaradmin')
      await frame.click('#topbaradmin')
      await frame.waitForSelector('#PplSearch')
      await frame.click('#PplSearch')
      await page.waitForTimeout(3000)
      // elementHandle = await frame.waitForSelector('#innerPageFrame')
      // frame = await elementHandle.contentFrame()
      await frame.waitForSelector('#el-collapse-content-7534 > div > div:nth-child(1) > div:nth-child(2) > div > div > div.el-input > input')
      await frame.type('#el-collapse-content-7534 > div > div:nth-child(1) > div:nth-child(2) > div > div > div.el-input > input', user['First Name'])
      await frame.waitForSelector('#el-collapse-content-7534 > div > div:nth-child(1) > div:nth-child(1) > div > div > div.el-input > input')
      await frame.type('#el-collapse-content-7534 > div > div:nth-child(1) > div:nth-child(1) > div > div > div.el-input > input', user['Last Name'])
      // click search
      await frame.click('#app > form > div.flex.h100 > div:nth-child(2) > div > div:nth-child(1) > footer > div > div.el-col.el-col-10 > button:nth-child(4) > span')
      // select student
      await frame.click(
        '#personsearch > div.ag-theme-balham > div > div.ag-root-wrapper-body.ag-layout-normal > div > div.ag-body.ag-layout-normal.ag-row-animation > div.ag-body-viewport-wrapper.ag-layout-normal > div > div > div > div:nth-child(1) > span > div.pointer'
      )

      await frame.click('#delete')
      console.log('student deleted')
    }
    await frame.waitForSelector('#topbaradmin')
    await frame.click('#topbaradmin')
    await frame.waitForSelector('#PplAdd')
    await frame.click('#PplAdd')
    await page.waitForTimeout(5000)
    elementHandle = await frame.waitForSelector('#innerPageFrame')
    frame = await elementHandle.contentFrame()
    await frame.waitForSelector('#lastname')
    await frame.click('#lastname')
    await frame.type('#lastname', user['Last Name'])
    await frame.type('#firstname', user['First Name'])
    console.log('first name added')
    await frame.waitForSelector('#expirationdate_date')
    await frame.type('#expirationdate_date', '10/1/2024 00:00', { delay: 100 })
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

  // Charge new member fee

  await page.goto('https://resource.cores.utah.edu/auth/login')

  await page.waitForSelector('#form-group-input')
  await page.type('input[name="username"]', 'u0480789')

  await page.waitForSelector('#form-group-input')
  await page.type('input[name="password"]', 'Amelia_jane1')

  await page.waitForSelector('#content > form > div:nth-child(3) > button')
  await page.click('#content > form > div:nth-child(3) > button')

  await navigationPromise

  for (const user of users) {
    await page.goto('https://resource.cores.utah.edu/#/group/13')
    await page.waitForSelector('div > div > div:nth-child(2) > div > .bp4-callout:nth-child(4)')
    await page.click('div > div > div:nth-child(2) > div > .bp4-callout:nth-child(4)')

    await page.waitForSelector('div > div:nth-child(16) > .bp4-button > .bp4-icon > svg')
    await page.click('div > div:nth-child(16) > .bp4-button > .bp4-icon > svg')

    await page.waitForSelector('div:nth-child(1) > div > div:nth-child(2) > .bp4-button > .bp4-icon-caret-down > svg')
    await page.click('div:nth-child(1) > div > div:nth-child(2) > .bp4-button > .bp4-icon-caret-down > svg')

    await page.waitForSelector('.bp4-collapse > .bp4-collapse-body > div > div > .bp4-callout:nth-child(2)')
    await page.click('.bp4-collapse > .bp4-collapse-body > div > div > .bp4-callout:nth-child(2)')

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
      user.firstName + ' ' + user.lastName
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
  await browser.close()
  console.log('all members added successfully')
})()

// node index --disable-web-security, ----disable-features=IsolateOrigins,site-per-process
