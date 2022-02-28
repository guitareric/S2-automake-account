const puppeteer = require('puppeteer')
const fs = require('fs')

;(async () => {
  const users = [
    { name: 'Fake Name1', prox: '111111' },
    { name: 'Fake Name2', prox: '111111' },
  ]
  const browser = await puppeteer.launch({ slowMo: 150, headless: false, ignoreHTTPSErrors: true, args: ['--ignore-certificate-errors', '--enable-feature=NetworkService'] })
  const page = await browser.newPage()

  await page.setViewport({ width: 800, height: 600 })

  console.log('Session has been loaded in the browser')

  await page.goto('https://155.98.92.189/frameset/')
  console.log('Logging in...')
  await page.waitForSelector('#username')
  await page.type('#username', 'ericf')
  await page.type('#password', 'Amelia_jane1')
  await page.keyboard.press('Enter')
  console.log('login successful')
  await page.waitForTimeout(1000)
  await page.mouse.click(77.35417175292969, 3, { button: 'left' })
  console.log('admin panel clicked')

  await page.waitForTimeout(500)
  await page.mouse.click(20, 280.6666717529297, { button: 'left' })
  console.log('add people clicked')
  await page.waitForTimeout(8000)
  await page.mouse.move(400, 400)
  await page.mouse.click(20, 280.6666717529297, { button: 'left' })
  await page.waitForTimeout(1000)
  await page.keyboard.press('Tab')
  await page.waitForTimeout(500)
  await page.keyboard.type('lastname')
  await page.keyboard.press('Tab')
  await page.waitForTimeout(500)
  await page.keyboard.type('firstname')
  await page.waitForTimeout(500)
  await page.keyboard.press('Tab')
  await page.waitForTimeout(500)
  await page.keyboard.press('Tab')
  await page.waitForTimeout(500)
  await page.keyboard.press('Tab')
  await page.waitForTimeout(500)
  await page.keyboard.press('Tab')
  await page.keyboard.type('03/22/2023 00:00')
  await page.keyboard.press('Tab')
  await page.waitForTimeout(100000)

  await page.click('#tab-credentialtab')

  await page.waitForSelector('#addcredential')
  await page.click('#addcredential')

  await page.waitForSelector('#encodednumber0')
  await page.type('#encodednumber0', '123456')

  await page.click('#tab-accesstab')
  await page.waitForSelector('#\\36 0 > td:nth-child(3)')
  await page.click('#\\36 0 > td:nth-child(3)')
  await page.click('#uparrow')
  await page.waitForTimeout(500)
  await page.click('#save')
})()
