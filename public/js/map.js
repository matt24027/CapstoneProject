// public/js/map.js

// Initialize the map centered on Durham, NC
const map = L.map('map').setView([36.0014, -78.9382], 13);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap'
}).addTo(map);

// Function to load resource markers
async function loadResourceMarkers() {
  try {
    const response = await fetch('/api/resources');
    const data = await response.json();
    
    data.forEach(resource => {
      const marker = L.marker([resource.latitude, resource.longitude]).addTo(map);
      marker.bindPopup(`<b>${resource.name}</b><br>${resource.description}`);
    });
  } catch (error) {
    console.error('Error loading resources:', error);
  }
}

loadResourceMarkers();
