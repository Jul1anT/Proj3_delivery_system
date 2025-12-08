// Delivery Route Optimization System
// Using Graph Theory and Nearest Neighbor Algorithm

class DeliveryOptimizer {
    constructor() {
        this.points = [];
        this.map = null;
        this.markers = [];
        this.routePolyline = null;
        this.optimizedRoute = null;
        this.pointIdCounter = 0;
        this.autocompleteResults = [];
        this.selectedAutocompleteIndex = -1;
        this.autocompleteTimeout = null;
        this.lastGeocodingCall = 0;
        this.GEOCODING_DELAY = 1000; // Rate limit: 1 second between calls
        this.COORDINATE_REGEX = /(-?\d+(?:\.\d+)?),?\s*(-?\d+(?:\.\d+)?)/;
        this.init();
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    init() {
        this.initMap();
        this.setupEventListeners();
    }

    initMap() {
        // Initialize map centered on a default location
        this.map = L.map('map').setView([19.4326, -99.1332], 13); // Mexico City default

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Add click event to map
        this.map.on('click', (e) => {
            this.addPoint(e.latlng.lat, e.latlng.lng);
        });
    }

    setupEventListeners() {
        const addressInput = document.getElementById('addressInput');
        
        document.getElementById('addPointBtn').addEventListener('click', () => {
            this.addPointFromInput();
        });

        addressInput.addEventListener('input', (e) => {
            this.handleAddressInput(e.target.value);
        });

        addressInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        addressInput.addEventListener('blur', () => {
            // Delay hiding to allow click on autocomplete item
            setTimeout(() => this.hideAutocomplete(), 200);
        });

        addressInput.addEventListener('focus', (e) => {
            if (e.target.value.trim().length >= 3) {
                this.handleAddressInput(e.target.value);
            }
        });

        document.getElementById('optimizeBtn').addEventListener('click', () => {
            this.optimizeRoute();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearAll();
        });
    }

    clearAddressInput() {
        document.getElementById('addressInput').value = '';
    }

    handleAddressInput(value) {
        // Clear previous timeout
        if (this.autocompleteTimeout) {
            clearTimeout(this.autocompleteTimeout);
        }

        const trimmedValue = value.trim();

        // Hide autocomplete if input is too short
        if (trimmedValue.length < 3) {
            this.hideAutocomplete();
            return;
        }

        // Check if it's coordinates
        const coordMatch = trimmedValue.match(this.COORDINATE_REGEX);
        if (coordMatch) {
            this.hideAutocomplete();
            return;
        }

        // Show loading state
        this.showAutocompleteLoading();

        // Debounce the API call
        this.autocompleteTimeout = setTimeout(() => {
            this.fetchAddressSuggestions(trimmedValue);
        }, 300);
    }

    async fetchAddressSuggestions(query) {
        try {
            // Rate limiting: ensure at least 1 second between calls
            const now = Date.now();
            const timeSinceLastCall = now - this.lastGeocodingCall;
            if (timeSinceLastCall < this.GEOCODING_DELAY) {
                await new Promise(resolve => setTimeout(resolve, this.GEOCODING_DELAY - timeSinceLastCall));
            }
            this.lastGeocodingCall = Date.now();

            // Use Nominatim's search API with more detailed results
            // Including User-Agent header as per Nominatim usage policy
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'DeliveryRouteOptimizer/1.0'
                    }
                }
            );
            const data = await response.json();
            
            this.autocompleteResults = data;
            this.displayAutocompleteSuggestions(data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            this.hideAutocomplete();
        }
    }

    displayAutocompleteSuggestions(results) {
        const container = document.getElementById('autocompleteResults');
        
        if (!results || results.length === 0) {
            container.innerHTML = '<div class="autocomplete-no-results">No se encontraron resultados</div>';
            container.classList.add('active');
            return;
        }

        container.innerHTML = '';
        results.forEach((result, index) => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.dataset.index = index;
            
            // Extract main address and details
            const mainAddress = this.getMainAddress(result);
            const details = this.getAddressDetails(result);
            
            item.innerHTML = `
                <div class="autocomplete-item-main">${this.escapeHtml(mainAddress)}</div>
                <div class="autocomplete-item-detail">${this.escapeHtml(details)}</div>
            `;
            
            item.addEventListener('click', () => {
                this.selectAutocompleteSuggestion(index);
            });
            
            container.appendChild(item);
        });
        
        container.classList.add('active');
        this.selectedAutocompleteIndex = -1;
    }

    getMainAddress(result) {
        // Try to get the most specific address component
        if (result.address) {
            const addr = result.address;
            return addr.road || addr.suburb || addr.city || addr.town || addr.village || result.display_name.split(',')[0];
        }
        return result.display_name.split(',')[0];
    }

    getAddressDetails(result) {
        if (result.address) {
            const addr = result.address;
            const parts = [];
            
            if (addr.house_number) parts.push(addr.house_number);
            if (addr.suburb && addr.suburb !== this.getMainAddress(result)) parts.push(addr.suburb);
            if (addr.city) parts.push(addr.city);
            if (addr.state) parts.push(addr.state);
            if (addr.country) parts.push(addr.country);
            
            return parts.join(', ') || result.display_name;
        }
        return result.display_name;
    }

    showAutocompleteLoading() {
        const container = document.getElementById('autocompleteResults');
        container.innerHTML = '<div class="autocomplete-loading">Buscando direcciones...</div>';
        container.classList.add('active');
    }

    hideAutocomplete() {
        const container = document.getElementById('autocompleteResults');
        container.classList.remove('active');
        container.innerHTML = '';
        this.selectedAutocompleteIndex = -1;
    }

    handleKeyNavigation(e) {
        const container = document.getElementById('autocompleteResults');
        if (!container.classList.contains('active') || this.autocompleteResults.length === 0) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addPointFromInput();
            }
            return;
        }

        const items = container.querySelectorAll('.autocomplete-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedAutocompleteIndex = Math.min(this.selectedAutocompleteIndex + 1, items.length - 1);
            this.updateAutocompleteSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedAutocompleteIndex = Math.max(this.selectedAutocompleteIndex - 1, -1);
            this.updateAutocompleteSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.selectedAutocompleteIndex >= 0) {
                this.selectAutocompleteSuggestion(this.selectedAutocompleteIndex);
            } else {
                this.addPointFromInput();
            }
        } else if (e.key === 'Escape') {
            this.hideAutocomplete();
        }
    }

    updateAutocompleteSelection(items) {
        items.forEach((item, index) => {
            if (index === this.selectedAutocompleteIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    selectAutocompleteSuggestion(index) {
        const result = this.autocompleteResults[index];
        if (result) {
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);
            
            // Validate coordinate ranges
            if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                this.addPoint(lat, lng, result.display_name);
                this.clearAddressInput();
                this.hideAutocomplete();
                this.map.setView([lat, lng], 15);
            }
        }
    }

    addPointFromInput() {
        const input = document.getElementById('addressInput').value.trim();
        if (!input) return;

        // Hide autocomplete
        this.hideAutocomplete();

        // Try to parse as coordinates (lat, lng)
        const coordMatch = input.match(this.COORDINATE_REGEX);
        if (coordMatch) {
            const lat = parseFloat(coordMatch[1]);
            const lng = parseFloat(coordMatch[2]);
            
            // Validate coordinate ranges
            if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                this.addPoint(lat, lng);
                this.clearAddressInput();
            } else {
                alert('Coordenadas inválidas. Latitud debe estar entre -90 y 90, Longitud entre -180 y 180.');
            }
        } else {
            // Use first autocomplete result if available, otherwise geocode
            if (this.autocompleteResults.length > 0) {
                this.selectAutocompleteSuggestion(0);
            } else {
                this.geocodeAddress(input);
            }
        }
    }

    async geocodeAddress(address) {
        try {
            // Rate limiting
            const now = Date.now();
            const timeSinceLastCall = now - this.lastGeocodingCall;
            if (timeSinceLastCall < this.GEOCODING_DELAY) {
                await new Promise(resolve => setTimeout(resolve, this.GEOCODING_DELAY - timeSinceLastCall));
            }
            this.lastGeocodingCall = Date.now();

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
                {
                    headers: {
                        'User-Agent': 'DeliveryRouteOptimizer/1.0'
                    }
                }
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                
                // Validate coordinate ranges
                if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                    this.addPoint(lat, lng, data[0].display_name);
                    this.clearAddressInput();
                    this.map.setView([lat, lng], 13);
                } else {
                    alert('Coordenadas inválidas recibidas del servicio de geocodificación.');
                }
            } else {
                alert('No se pudo encontrar la dirección. Intenta con coordenadas (lat, lng).');
            }
        } catch (error) {
            console.error('Error al geocodificar:', error);
            alert('Error al buscar la dirección. Intenta con coordenadas (lat, lng).');
        }
    }

    addPoint(lat, lng, address = null) {
        const point = {
            id: ++this.pointIdCounter,
            lat: lat,
            lng: lng,
            address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        };

        this.points.push(point);
        this.addMarker(point);
        this.updatePointsList();
        
        // Adjust map view to show all points
        if (this.points.length > 0) {
            const bounds = L.latLngBounds(this.points.map(p => [p.lat, p.lng]));
            this.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    addMarker(point) {
        const marker = L.marker([point.lat, point.lng], {
            icon: this.createNumberedIcon(this.points.length)
        }).addTo(this.map);

        marker.bindPopup(`
            <div style="text-align: center;">
                <strong>Punto ${this.points.length}</strong><br>
                ${this.escapeHtml(point.address)}<br>
                <button onclick="app.openInGoogleMaps(${point.lat}, ${point.lng})" 
                        style="margin-top: 10px; padding: 8px 15px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    📍 Abrir en Google Maps
                </button>
            </div>
        `);

        this.markers.push({ id: point.id, marker: marker });
    }

    createNumberedIcon(number) {
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background: #667eea;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">${number}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
    }

    updatePointsList() {
        const list = document.getElementById('pointsList');
        list.innerHTML = '';

        if (this.points.length === 0) {
            list.innerHTML = '<p style="color: #718096; text-align: center;">No hay puntos agregados</p>';
            return;
        }

        this.points.forEach((point, index) => {
            const div = document.createElement('div');
            div.className = 'point-item';
            div.innerHTML = `
                <div class="point-info">
                    <span class="point-number">${index + 1}</span>
                    <div class="point-coords">${this.escapeHtml(point.address)}</div>
                </div>
                <div class="point-actions">
                    <button class="btn btn-small btn-maps" onclick="app.openInGoogleMaps(${point.lat}, ${point.lng})">
                        📍 GPS
                    </button>
                    <button class="btn btn-small btn-secondary" onclick="app.removePoint(${point.id})">
                        ✕
                    </button>
                </div>
            `;
            list.appendChild(div);
        });
    }

    removePoint(id) {
        const index = this.points.findIndex(p => p.id === id);
        if (index !== -1) {
            this.points.splice(index, 1);
            
            // Remove marker
            const markerObj = this.markers.find(m => m.id === id);
            if (markerObj) {
                this.map.removeLayer(markerObj.marker);
                this.markers = this.markers.filter(m => m.id !== id);
            }

            // Update remaining markers with new numbers
            this.updateMarkers();
            this.updatePointsList();
            
            // Clear route if exists
            if (this.routePolyline) {
                this.map.removeLayer(this.routePolyline);
                this.routePolyline = null;
            }
            document.getElementById('routeInfo').style.display = 'none';
        }
    }

    updateMarkers() {
        // Remove all markers
        this.markers.forEach(m => this.map.removeLayer(m.marker));
        this.markers = [];

        // Re-add markers with updated numbers
        this.points.forEach((point, index) => {
            const marker = L.marker([point.lat, point.lng], {
                icon: this.createNumberedIcon(index + 1)
            }).addTo(this.map);

            marker.bindPopup(`
                <div style="text-align: center;">
                    <strong>Punto ${index + 1}</strong><br>
                    ${this.escapeHtml(point.address)}<br>
                    <button onclick="app.openInGoogleMaps(${point.lat}, ${point.lng})" 
                            style="margin-top: 10px; padding: 8px 15px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        📍 Abrir en Google Maps
                    </button>
                </div>
            `);

            this.markers.push({ id: point.id, marker: marker });
        });
    }

    clearAll() {
        if (!confirm('¿Estás seguro de que deseas eliminar todos los puntos?')) {
            return;
        }

        this.points = [];
        this.markers.forEach(m => this.map.removeLayer(m.marker));
        this.markers = [];
        
        if (this.routePolyline) {
            this.map.removeLayer(this.routePolyline);
            this.routePolyline = null;
        }

        this.updatePointsList();
        document.getElementById('routeInfo').style.display = 'none';
        this.optimizedRoute = null;
    }

    openInGoogleMaps(lat, lng) {
        // Open Google Maps with the location and GPS navigation
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
        window.open(url, '_blank');
    }

    // Graph-based Route Optimization using Nearest Neighbor Algorithm
    optimizeRoute() {
        if (this.points.length < 2) {
            alert('Necesitas al menos 2 puntos para optimizar la ruta.');
            return;
        }

        // Build distance matrix (complete graph)
        const distanceMatrix = this.buildDistanceMatrix();

        // Apply Nearest Neighbor Algorithm (greedy approach for TSP)
        const route = this.nearestNeighborTSP(distanceMatrix);

        this.optimizedRoute = route;
        this.displayRoute(route);
        this.displayRouteInfo(route, distanceMatrix);
    }

    buildDistanceMatrix() {
        const n = this.points.length;
        const matrix = Array(n).fill(null).map(() => Array(n).fill(0));

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    matrix[i][j] = this.calculateDistance(
                        this.points[i].lat, this.points[i].lng,
                        this.points[j].lat, this.points[j].lng
                    );
                }
            }
        }

        return matrix;
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        // Haversine formula for distance between two coordinates
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * Math.PI / 180;
    }

    nearestNeighborTSP(distanceMatrix) {
        const n = distanceMatrix.length;
        const visited = Array(n).fill(false);
        const route = [];
        
        // Start from the first point (index 0)
        let current = 0;
        visited[current] = true;
        route.push(current);

        // Visit remaining points
        for (let i = 1; i < n; i++) {
            let nearest = -1;
            let minDistance = Infinity;

            // Find nearest unvisited neighbor
            for (let j = 0; j < n; j++) {
                if (!visited[j] && distanceMatrix[current][j] < minDistance) {
                    minDistance = distanceMatrix[current][j];
                    nearest = j;
                }
            }

            if (nearest !== -1) {
                visited[nearest] = true;
                route.push(nearest);
                current = nearest;
            }
        }

        return route;
    }

    displayRoute(route) {
        // Remove previous route if exists
        if (this.routePolyline) {
            this.map.removeLayer(this.routePolyline);
        }

        // Create route line
        const routeCoords = route.map(i => [this.points[i].lat, this.points[i].lng]);
        
        this.routePolyline = L.polyline(routeCoords, {
            color: '#48bb78',
            weight: 4,
            opacity: 0.8,
            smoothFactor: 1
        }).addTo(this.map);

        // Add arrows to show direction
        this.addRouteArrows(routeCoords);

        // Update markers to show route order
        this.updateMarkersWithRoute(route);
    }

    addRouteArrows(coords) {
        for (let i = 0; i < coords.length - 1; i++) {
            const midLat = (coords[i][0] + coords[i + 1][0]) / 2;
            const midLng = (coords[i][1] + coords[i + 1][1]) / 2;
            
            const angle = Math.atan2(
                coords[i + 1][0] - coords[i][0],
                coords[i + 1][1] - coords[i][1]
            ) * 180 / Math.PI;

            L.marker([midLat, midLng], {
                icon: L.divIcon({
                    className: 'route-arrow',
                    html: `<div style="transform: rotate(${angle}deg); font-size: 20px;">➤</div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                })
            }).addTo(this.map);
        }
    }

    updateMarkersWithRoute(route) {
        // Remove all markers
        this.markers.forEach(m => this.map.removeLayer(m.marker));
        this.markers = [];

        // Re-add markers in route order
        route.forEach((pointIndex, routeOrder) => {
            const point = this.points[pointIndex];
            const marker = L.marker([point.lat, point.lng], {
                icon: this.createOptimizedIcon(routeOrder + 1)
            }).addTo(this.map);

            marker.bindPopup(`
                <div style="text-align: center;">
                    <strong>Parada ${routeOrder + 1}</strong><br>
                    ${this.escapeHtml(point.address)}<br>
                    <button onclick="app.openInGoogleMaps(${point.lat}, ${point.lng})" 
                            style="margin-top: 10px; padding: 8px 15px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        📍 Abrir en Google Maps
                    </button>
                </div>
            `);

            this.markers.push({ id: point.id, marker: marker });
        });
    }

    createOptimizedIcon(number) {
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background: #48bb78;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 16px;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">${number}</div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });
    }

    displayRouteInfo(route, distanceMatrix) {
        const routeInfo = document.getElementById('routeInfo');
        const routeDetails = document.getElementById('routeDetails');
        
        let html = '';
        let totalDistance = 0;

        route.forEach((pointIndex, i) => {
            const point = this.points[pointIndex];
            let distance = 0;
            
            if (i < route.length - 1) {
                distance = distanceMatrix[pointIndex][route[i + 1]];
                totalDistance += distance;
            }

            html += `
                <div class="route-step">
                    <span class="route-step-number">Parada ${i + 1}:</span>
                    ${this.escapeHtml(point.address)}
                    ${i < route.length - 1 ? `<div class="route-distance">↓ ${distance.toFixed(2)} km</div>` : ''}
                </div>
            `;
        });

        html += `<div class="total-distance">Distancia Total: ${totalDistance.toFixed(2)} km</div>`;
        
        routeDetails.innerHTML = html;
        routeInfo.style.display = 'block';
    }
}

// Initialize the application
const app = new DeliveryOptimizer();
