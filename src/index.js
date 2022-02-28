const puppeteer = require('puppeteer')
const fs = require('fs')

;(async () => {
  const browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true, args: ['--ignore-certificate-errors', '--enable-feature=NetworkService'] })
  const page = await browser.newPage()
  //   const context = browser.defaultBrowserContext()
  //   context.overridePermissions('https://www.facebook.com/?sk=h_chr', ['geolocation', 'notifications'])
  //   const cookiesPath = 'cookies.txt'
  //   const content = fs.readFileSync(cookiesPath)
  //   const cookiesArr = JSON.parse(content)
  //   for (let cookie of cookiesArr) {
  //     await page.setCookie(cookie)
  //   }
  console.log('Session has been loaded in the browser')
  //   await page.goto('https://google.com')

  await page.goto('https://155.98.92.189/frameset/')
  console.log('Logging in...')
  //   await browser.close()

  //   await page.type('#email', process.env['FB_LOGIN'])
  //   await page.type('#pass', process.env['FB_PASSWORD'])
  //   await page.click('[name="login"]')
  //   await page.waitForNavigation()
  //   // Write Cookies
  //   const cookiesObject = await page.cookies()
  //   fs.writeFileSync(cookiesPath, JSON.stringify(cookiesObject))
  //   console.log('Session has been saved to ' + cookiesPath)

  //   console.log('Checking for new posts...')
  //   await page.goto('https://www.facebook.com/?sk=h_chr')
  //   const selector = '[aria-posinset="1"]'
  //   await page.waitForSelector(selector)
  //   var postHandle = await page.$(selector)
  //   currentPost = await postHandle.evaluate(el => el.innerText)
  //   // console.log(currentPost) // this will help for debugging to see the whole string that is returned
  //   currentPoster = parsePoster(currentPost)
  //   currentPost = parseComment(currentPost)
  //   if (previousPost == currentPost) {
  //     console.log('No new posts, refreshing in 60 seconds...')
  //     await page.waitForTimeout(60000)
  //   } else {
  //     console.log(`New poster ${currentPoster} said:\n ${currentPost}`)
  //     console.log('New post found! Checking for keywords...')
  //     if (
  //       currentPost.toLowerCase().includes('loan officer') ||
  //       currentPost.toLowerCase().includes('refinance') ||
  //       currentPost.toLowerCase().includes('mortgage') ||
  //       currentPost.toLowerCase().includes('mortgage rates') ||
  //       currentPost.toLowerCase().includes('sell house') ||
  //       currentPost.toLowerCase().includes('sell home') ||
  //       currentPost.toLowerCase().includes('buy house') ||
  //       currentPost.toLowerCase().includes('buy home') ||
  //       currentPost.toLowerCase().includes('home loan') ||
  //       currentPost.toLowerCase().includes('brokerage') ||
  //       currentPost.toLowerCase().includes('broker') ||
  //       currentPost.toLowerCase().includes('realitor') ||
  //       currentPost.toLowerCase().includes('realtor') ||
  //       currentPost.toLowerCase().includes('realiter') ||
  //       currentPost.toLowerCase().includes('realter')
  //     ) {
  //       console.log('Match found! Leaving comment and sending Email notification...')
  //       await autoScroll(page)
  //       await page.click('[aria-label="Leave a comment"]')
  //       await page.waitForSelector('[aria-label="Write a comment"]')
  //       const reply = 'My brother has been doing real estate and loans for over 10 years. He will be able to get you the best rates and the best deals. Contact @Blake Fluckiger or text/call him at 801-652-5478'
  //       await page.click('[aria-label="Write a comment"]')
  //       await page.type('[aria-label="Write a comment"]', reply)
  //       await page.keyboard.press('Enter')
  //       mailer(currentPost, currentPoster, reply)
  //       console.log('Comment and Email notification sent, refreshing in 60 seconds...')
  //       await page.waitForTimeout(5000)
  //     } else {
  //       console.log('No match found, refreshing in 60 seconds...')
  //       await page.waitForTimeout(60000)
  //     }
  //   }
  //   previousPost = currentPost
  //   previousPoster = currentPoster
})()
