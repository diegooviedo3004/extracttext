const express = require('express');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

// Unlimited payload configuration (DANGEROUS)
app.use(express.json({ limit: '50mb' })); // Set to 50MB as "unlimited"

app.post('/extract-text', (req, res) => {
  try {
    const $ = cheerio.load(req.body.html || '');
    const bodyText = $('body').text()
      .replace(/\s+/g, ' ')
      .trim();
    res.send(bodyText);
  } catch (error) {
    res.status(500).send('Error processing HTML');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
