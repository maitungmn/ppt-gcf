const puppeteer = require('puppeteer');
let page;

async function getBrowserPage() {
    // Launch headless Chrome. Turn off sandbox so Chrome can run under root.
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    return browser.newPage();
}

exports.screenshot = async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.send('Please provide URL as GET parameter, for example: ' +
            '<a href="?url=https://example.com">?url=https://example.com</a>');
    }

    if (!page) {
        page = await getBrowserPage();
    }

    const override = Object.assign(page.viewport(), {width: 1000});
    await page.setViewport(override);
    await page.goto(url);
    const imageBuffer = await page.screenshot();
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
};
