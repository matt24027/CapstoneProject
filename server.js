const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 8080; // This is the port for your web server

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/shelterlink';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB on port 27017');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Parses incoming JSON requests

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Import the Resource model
const Resource = require('./models/Resource');


// API route to fetch resources
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await Resource.find({});
    res.json(resources);
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
