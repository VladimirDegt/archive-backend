const fs = require('fs/promises');

async function waitForFile(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = waitForFile