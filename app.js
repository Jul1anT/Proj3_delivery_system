// Backend URL configuration
const BACKEND_URL = 'http://localhost:5000';

let map;
let markers = [];
let polylines = [];
let points = [];

function initMap() {
    map = L.map('map').setView([40.7128, -74.0060], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    map.on('click', addPoint);
}

function addPoint(e) {
    const marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    markers.push(marker);
    points.push({lat: e.latlng.lat, lng: e.latlng.lng});
    updatePointsList();
}

function updatePointsList() {
    const list = document.getElementById('points-list');
    list.innerHTML = '';
    points.forEach((point, index) => {
        const li = document.createElement('li');
        li.textContent = `Point ${index + 1}: (${point.lat.toFixed(4)}, ${point.lng.toFixed(4)})`;
        list.appendChild(li);
    });
}

function clearPoints() {
    markers.forEach(marker => map.removeLayer(marker));
    polylines.forEach(polyline => map.removeLayer(polyline));
    markers = [];
    polylines = [];
    points = [];
    updatePointsList();
    document.getElementById('result').innerHTML = '';
}

/**
 * Build distance matrix using OSMnx routing backend API
 * @param {Array} points - Array of point objects with lat/lng
 * @returns {Promise<Array>} Distance matrix or null if failed
 */
async function buildDistanceMatrixOSM(points) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/distance_matrix`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ points: points }),
            // Set a timeout to fail fast if backend is not available
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
            console.warn(`Backend API returned status ${response.status}`);
            return null;
        }

        const data = await response.json();
        
        if (data.distance_matrix && Array.isArray(data.distance_matrix)) {
            console.log('Successfully retrieved distance matrix from OSMnx backend');
            return data.distance_matrix;
        } else {
            console.warn('Invalid distance matrix format from backend');
            return null;
        }
    } catch (error) {
        if (error.name === 'TimeoutError') {
            console.warn('Backend API request timed out');
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.warn('Backend is not available (network error)');
        } else {
            console.warn('Error calling backend API:', error.message);
        }
        return null;
    }
}

function buildDistanceMatrix(points) {
    const n = points.length;
    const matrix = [];
    
    for (let i = 0; i < n; i++) {
        matrix[i] = [];
        for (let j = 0; j < n; j++) {
            if (i === j) {
                matrix[i][j] = 0;
            } else {
                matrix[i][j] = haversineDistance(points[i], points[j]);
            }
        }
    }
    
    return matrix;
}

function haversineDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

async function optimizeRoute() {
    if (points.length < 2) {
        alert('Please add at least 2 points');
        return;
    }
    
    // Try to get distance matrix from OSMnx backend first
    console.log('Attempting to use OSMnx routing backend...');
    let distanceMatrix = await buildDistanceMatrixOSM(points);
    let usingBackend = false;
    
    if (distanceMatrix) {
        console.log('Using OSMnx routing with real road network distances');
        usingBackend = true;
    } else {
        // Fallback to Haversine formula if backend is unavailable
        console.log('Backend unavailable, falling back to Haversine distance calculation');
        distanceMatrix = buildDistanceMatrix(points);
    }
    
    // Solve TSP using nearest neighbor heuristic
    const route = nearestNeighborTSP(distanceMatrix);
    
    // Display results
    displayRoute(route, distanceMatrix, usingBackend);
}

function nearestNeighborTSP(distanceMatrix) {
    const n = distanceMatrix.length;
    const visited = new Array(n).fill(false);
    const route = [0]; // Start from first point
    visited[0] = true;
    
    let current = 0;
    for (let i = 1; i < n; i++) {
        let nearest = -1;
        let minDist = Infinity;
        
        for (let j = 0; j < n; j++) {
            if (!visited[j] && distanceMatrix[current][j] < minDist) {
                minDist = distanceMatrix[current][j];
                nearest = j;
            }
        }
        
        route.push(nearest);
        visited[nearest] = true;
        current = nearest;
    }
    
    route.push(0); // Return to start
    return route;
}

function displayRoute(route, distanceMatrix, usingBackend) {
    // Clear existing polylines
    polylines.forEach(polyline => map.removeLayer(polyline));
    polylines = [];
    
    // Draw route
    const routePoints = route.map(i => [points[i].lat, points[i].lng]);
    const polyline = L.polyline(routePoints, {color: 'blue', weight: 3}).addTo(map);
    polylines.push(polyline);
    
    // Calculate total distance
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        totalDistance += distanceMatrix[route[i]][route[i+1]];
    }
    
    // Display result
    const resultDiv = document.getElementById('result');
    const methodUsed = usingBackend ? 'OSMnx (Real road network)' : 'Haversine (Straight-line)';
    resultDiv.innerHTML = `
        <h3>Optimized Route:</h3>
        <p><strong>Method:</strong> ${methodUsed}</p>
        <p><strong>Order:</strong> ${route.map(i => i + 1).join(' → ')}</p>
        <p><strong>Total Distance:</strong> ${totalDistance.toFixed(2)} km</p>
    `;
}

// Initialize map when page loads
window.onload = initMap;