const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 8080; // This is the port for your web server

// MongoDB Atlas connection string (ensure password is URL-encoded)
const mongoURI = 'mongodb+srv://matthewpswepson:Narutotail4270%24@shelterlink.3t51c.mongodb.net/shelterlink?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Parses incoming JSON requests

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API route to fetch resources from multiple collections
app.get('/api/resources', async (req, res) => {
  try {
    console.log('Fetching data from collections...');

    // Fetch data from each collection
    const domesticViolenceShelters = await mongoose.connection.db.collection('DomesticViolenceShelters').find({}).toArray();
    const faithBasedNonprofits = await mongoose.connection.db.collection('FaithBasedNonprofits').find({}).toArray();
    const foodAssistanceNonprofits = await mongoose.connection.db.collection('FoodAssistanceNonprofits').find({}).toArray();
    const healthcareNonprofits = await mongoose.connection.db.collection('HealthcareNonprofits').find({}).toArray();
    const housingNonprofits = await mongoose.connection.db.collection('HousingNonprofits').find({}).toArray();
    const resources = await mongoose.connection.db.collection('resources').find({}).toArray();
    const veteransServicesNonprofits = await mongoose.connection.db.collection('VeteransServicesNonprofits').find({}).toArray();

    // Combine all results
    const allResources = [
      ...domesticViolenceShelters,
      ...faithBasedNonprofits,
      ...foodAssistanceNonprofits,
      ...healthcareNonprofits,
      ...housingNonprofits,
      ...resources,
      ...veteransServicesNonprofits
    ].map(resource => ({
      name: resource.name,
      description: resource.description,
      latitude: resource.address?.latitude,
      longitude: resource.address?.longitude
    }));

    // Filter out any resources without coordinates
    const validResources = allResources.filter(resource => resource.latitude && resource.longitude);

    console.log('Formatted Resources:', validResources);
    res.json(validResources);
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve "index.html" at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
