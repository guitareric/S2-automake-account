const readline = require('readline')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))
;(async () => {
  const users = [
    { name: 'Fake Name1', prox: '111111' },
    { name: 'Fake Name2', prox: '111111' },
  ]
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    slowMo: 0,
    args: ['--window-size=1400,900', '--disable-gpu', '--disable-features=IsolateOrigins,site-per-process', '--blink-settings=imagesEnabled=true'],
  })
  const page = await browser.newPage()

  await page.setViewport({ width: 1920, height: 1280 })

  console.log('Session has been loaded in the browser')

  await page.goto('https://155.98.92.189/frameset/')
  console.log('Logging in...')
  await page.waitForSelector('#username')
  await page.type('#username', 'ericf')
  await page.type('#password', 'Amelia_jane1')
  await page.keyboard.press('Enter')
  console.log('login successful')
  await page.waitForTimeout(1000)
  const cookies = await page.cookies()
  await page.goto('https://155.98.92.189/ui/person/new')
  await page.setCookie(...cookies)
  var frames = await page.frames()
  var myframe = frames.find(f => f.url('https://155.98.92.189/ui/person/new'))
  console.log('filling form in iframe')
  await page.waitForSelector('#lastname')
  await myframe.type('#lastname', 'lastname', { delay: 100 })
  await page.waitForTimeout(425)
  await myframe.type('#firstname', 'firstname', { delay: 100 })
  await page.waitForTimeout(536)
  // await page.waitForSelector('#expirationdate_date')
  // await myframe.type('#expirationdate_date', '03/01/2023 00:00', { delay: 100 })
  // await page.waitForTimeout(167)
  // await myframe.click('#tab-accesstab')
  // await page.waitForSelector('#\\36 0 > td:nth-child(3)')
  // await myframe.click('#\\36 0 > td:nth-child(3)')
  // await page.waitForTimeout(247)
  // await myframe.click('#uparrow')
  // await page.waitForTimeout(114)

  // await myframe.click('#tab-credentialtab')

  // await page.waitForSelector('#addcredential')
  // await myframe.click('#addcredential')

  // await page.waitForSelector('#encodednumber0')
  // await myframe.type('#encodednumber0', '123456')
  // await page.waitForTimeout(1345)
  console.log('about to click save')
  await page.waitForTimeout(5000)

  await myframe.click('#save')
  await page.waitForTimeout(2000)
  await browser.close()
})()

// node index --disable-web-security, ----disable-features=IsolateOrigins,site-per-process
