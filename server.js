const express = require('express');
const gplay = require('google-play-scraper').default;
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── helpers ──────────────────────────────────────────────────────────────────
function clean(app) {
  return {
    appId: app.appId,
    title: app.title,
    developer: app.developer,
    icon: app.icon,
    score: app.score ? app.score.toFixed(1) : 'N/A',
    ratings: app.ratings ? app.ratings.toLocaleString() : '0',
    installs: app.installs || 'N/A',
    price: app.price === 0 ? 'Free' : `$${app.price}`,
    free: app.free,
    genre: app.genre || '',
    genreId: app.genreId || '',
    summary: app.summary || '',
    description: app.description || '',
    version: app.version || 'N/A',
    size: app.size || 'N/A',
    updated: app.updated || '',
    androidVersion: app.androidVersionText || app.androidVersion || 'N/A',
    screenshots: app.screenshots || [],
    headerImage: app.headerImage || '',
    video: app.video || '',
    contentRating: app.contentRating || '',
    url: `https://play.google.com/store/apps/details?id=${app.appId}`,
  };
}

// ── routes ───────────────────────────────────────────────────────────────────

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Search apps
app.get('/api/search', async (req, res) => {
  const { q = '', page = 0, num = 20 } = req.query;
  if (!q.trim()) return res.json({ results: [] });
  try {
    const results = await gplay.search({
      term: q,
      num: parseInt(num),
      lang: 'en',
      country: 'us',
      fullDetail: false,
    });
    res.json({ results: results.map(clean) });
  } catch (e) {
    console.error('Search error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Top charts by category
app.get('/api/top', async (req, res) => {
  const { category = 'APPLICATION', collection = 'TOP_FREE', num = 3000 } = req.query;
  try {
    const results = await gplay.list({
      category: gplay.category[category] || gplay.category.APPLICATION,
      collection: gplay.collection[collection] || gplay.collection.TOP_FREE,
      num: parseInt(num),
      lang: 'en',
      country: 'us',
    });
    res.json({ results: results.map(clean) });
  } catch (e) {
    console.error('Top error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// App detail
app.get('/api/app/:appId', async (req, res) => {
  try {
    const result = await gplay.app({
      appId: req.params.appId,
      lang: 'en',
      country: 'us',
    });
    res.json(clean(result));
  } catch (e) {
    console.error('App detail error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Similar apps
app.get('/api/similar/:appId', async (req, res) => {
  try {
    const results = await gplay.similar({
      appId: req.params.appId,
      lang: 'en',
      country: 'us',
      num: 12,
    });
    res.json({ results: results.map(clean) });
  } catch (e) {
    console.error('Similar error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// App reviews
app.get('/api/reviews/:appId', async (req, res) => {
  try {
    const { data } = await gplay.reviews({
      appId: req.params.appId,
      lang: 'en',
      country: 'us',
      sort: gplay.sort.HELPFULNESS,
      num: 5,
    });
    res.json({ reviews: data });
  } catch (e) {
    console.error('Reviews error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Categories list
app.get('/api/categories', (req, res) => {
  const cats = [
    { id: 'APPLICATION', label: 'All Apps', icon: 'ti-apps' },
    { id: 'OWN APPS', label: 'Stickers', icon: 'ti-mood-smile' },
    { id: 'GAME', label: 'Games', icon: 'ti-device-gamepad-2' },
    { id: 'COMMUNICATION', label: 'Social', icon: 'ti-messages' },
    { id: 'PERSONALIZATION', label: 'Personalization', icon: 'ti-messages' },
    { id: 'TOOLS', label: 'Tools', icon: 'ti-tool' },
    { id: 'VIDEO_PLAYERS', label: 'Media', icon: 'ti-photo-video' },
    { id: 'PRODUCTIVITY', label: 'Productivity', icon: 'ti-checklist' },
    { id: 'FINANCE', label: 'Finance', icon: 'ti-wallet' },
    { id: 'HEALTH_AND_FITNESS', label: 'Health', icon: 'ti-heartbeat' },
    { id: 'EDUCATION', label: 'Education', icon: 'ti-school' },
    { id: 'PHOTOGRAPHY', label: 'Photography', icon: 'ti-camera' },
    { id: 'MUSIC_AND_AUDIO', label: 'Music', icon: 'ti-music' },
    { id: 'TRAVEL_AND_LOCAL', label: 'Travel', icon: 'ti-map-2' },
    { id: 'SHOPPING', label: 'Shopping', icon: 'ti-shopping-cart' },
    { id: 'NEWS_AND_MAGAZINES', label: 'News', icon: 'ti-news' },
    { id: 'SPORTS', label: 'Sports', icon: 'ti-ball-football' },
    { id: 'FOOD_AND_DRINK', label: 'Food & Drink', icon: 'ti-soup' }
  ];
  res.json({ categories: cats });
});

app.get('/api/sgapps-stickers', async (req, res) => {
  try {
    const results = await gplay.developer({
      devId: 'SG Apps Tech',
      num: 200,
      lang: 'en',
      country: 'us'
    });

    const stickerApps = results.filter(app =>
      app.title?.toLowerCase().includes('sticker')
    );

    res.json({
      results: stickerApps.map(clean)
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅  AppVault running at http://localhost:${PORT}\n`);
});
