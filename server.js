const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Use the specified port or 3000 by default

// Define the path to your static files (HTML, CSS, JavaScript, images, etc.)
const publicDirectoryPath = path.join(__dirname, 'public');

// Serve static files from the 'public' directory
app.use(express.static(publicDirectoryPath));

// Define a route to handle requests for your HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
