const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../config/cloudinary.js');
const Profile = require('../models/profile.js');

const router = express.Router();
const upload = multer({dest: 'uploads/'});

router.post('/', upload.any(), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files[0]; // Get the first file
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'profiles',
      // Cloudinary compression logic
      quality: 'auto:good', // or 'auto:best', 'auto:eco', or specific number like 80
      fetch_format: 'auto', // Automatically choose best format (WebP, AVIF, etc.)
      width: 1200,
      height: 1200,
      crop: 'limit', // Don't enlarge smaller images
      flags: 'progressive' // Progressive JPEG loading
    });

    fs.unlinkSync(file.path);

    const profile = new Profile({
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        url: result.secure_url,
        userID: req.body.userID
    });

    await profile.save();

    res.json(profile);

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({
      message: 'Upload failed',
      error: err.message
    });
  }
});


// GET: http://localhost:3001/api/upload/test-cloudinary
router.get('/test-cloudinary', async (req, res) => {
  try {
    console.log('Testing Cloudinary connection...');
    const result = await cloudinary.api.ping();
    res.json({
      message: 'Cloudinary connected successfully',
      result,
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing'
      }
    });
  } catch (err) {
    console.error('Cloudinary test error:', err);
    res.status(500).json({
      message: 'Cloudinary connection failed',
      error: err.message
    });
  }
});

module.exports = router;
