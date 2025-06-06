const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary.js');

const { profileupload } = require('../controllers/profilesControllers.js');

const router = express.Router();
const upload = multer({dest: 'uploads/'});

router.post('/', upload.any(), profileupload );


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
