import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { authMiddleware } from './Middleware/authmiddleware.js';  // Protect notifications

const router = express.Router();

// Handle ES module paths for __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to notifications JSON file
const notificationsFilePath = path.join(__dirname, './data/notifications.json');

// Route to get notifications
router.get('/',authMiddleware, (req, res) => {
  fs.readFile(notificationsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notifications file:', err);
      return res.status(500).json({ message: 'Error reading notifications data' });
    }
    try {
      const notifications = JSON.parse(data);
      res.json(notifications);
    } catch (parseErr) {
      console.error('Error parsing notifications JSON:', parseErr);
      res.status(500).json({ message: 'Error parsing notifications data' });
    }
  });
});

export default router;
