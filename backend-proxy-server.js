const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/download', async (req, res) => {
  const instagramUrl = req.query.url;
  if (!instagramUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Example using igram.io API as backend proxy
    const apiUrl = `https://api.igram.io/api?url=${encodeURIComponent(instagramUrl)}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch from Instagram API' });
    }
    const data = await response.json();

    if (data) {
      // Check if API returns multiple media items (carousel, story, reels)
      if (data.media && Array.isArray(data.media) && data.media.length > 0) {
        // Return array of media URLs
        return res.json({ media: data.media });
      } else if (data.videoUrl) {
        return res.json({ media: [data.videoUrl] });
      } else if (data.imageUrl) {
        return res.json({ media: [data.imageUrl] });
      } else {
        return res.status(404).json({ error: 'Media URL not found in API response' });
      }
    } else {
      return res.status(404).json({ error: 'Video URL not found in API response' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend proxy server running on http://localhost:${PORT}`);
});
