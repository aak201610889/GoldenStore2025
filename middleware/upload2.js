const multer = require('multer');

const storage = multer.memoryStorage(); // Store file in memory
const uploadMemory = multer({ storage });

module.exports = uploadMemory;
