# Delivery Route Optimizer System 📦

Interactive web system for delivery route optimization based on graph theory and heuristic algorithms.

## 🚀 Features

- **Smart Address Search with Autocomplete**: Easily find addresses by typing street names, cities or postal codes, similar to Google Maps
- **Interactive Map**: Visualize all delivery points on a map using Leaflet.js
- **Intelligent Optimization**: Calculates the most efficient route using the Nearest Neighbor algorithm
- **Stop Order**: Shows the optimal delivery sequence with distances between stops
- **GPS Integration**: Button to open each destination in Google Maps with navigation enabled
- **Modern Interface**: Minimalist and easy-to-use design
- **Academic Documentation**: Complete explanation of the mathematical model and algorithms

## 📋 Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (to load maps and geocoding services)

## 🎯 How to Use

1. Open the `index.html` file in your web browser
2. Add delivery points in three ways:
   - **Autocomplete search**: Type an address and select from suggestions (like Google Maps!)
   - Click directly on the map
   - Enter coordinates (format: lat, lng)
3. Click "Optimize Route" to calculate the best route
4. View the optimal route with suggested stop order
5. Use the "📍 GPS" button to open each destination in Google Maps

### Example for Bogotá, Colombia

Try these delivery points in Bogotá:
- Plaza de Bolívar: `4.5981, -74.0758`
- Museo del Oro: `4.6017, -74.0720`
- Zona Rosa: `4.6653, -74.0529`
- Parque 93: `4.6756, -74.0487`

Or simply search: "Plaza de Bolivar, Bogota"

## 🧮 Technology and Algorithms

### Graph Theory
The system models the route problem as a complete weighted graph:
- **Nodes**: Delivery points with geographic coordinates
- **Edges**: Connections between points with distance as weight
- **Objective**: Find the shortest path that visits all nodes

### Advanced Route Optimization
Multi-stage optimization algorithm combining:

**1. Multi-start Nearest Neighbor**
- Tests all possible starting points
- Selects the best initial route
- O(n³) complexity for better results

**2. 2-opt Local Search**
- Improves route by swapping edges
- Eliminates crossing paths
- Iterates until no improvements found

**3. Real Street Routing**
- Uses OSRM (Open Source Routing Machine) for real road distances
- Fallback to Haversine formula if offline
- Considers actual drivable routes

### Distance Calculation
Two methods for calculating distances:

**OSRM API (Primary):**
- Real street network distances
- Considers one-way streets and road connectivity
- Used when internet connection available

**Haversine Formula (Fallback):**
Calculates great-circle distances considering Earth's curvature:
```
a = sin²(Δφ/2) + cos(φ₁) × cos(φ₂) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1-a))
d = R × c
```

## 📂 Project Structure

```
delivery_system/
├── index.html           # Main application page
├── app.js              # Optimization logic and map handling
├── styles.css          # Modern and responsive styles
├── documentation.html  # Complete academic documentation
├── USAGE.md            # Detailed usage guide
├── EXAMPLES.md         # Usage examples (includes Bogotá routes)
└── README.md           # This file
```

## 🎨 Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Modern design with gradients and animations
- **JavaScript ES6+**: Application logic
- **Leaflet.js**: Interactive maps
- **OpenStreetMap**: Cartographic data
- **Nominatim**: Geocoding service
- **Google Maps API**: GPS navigation

## 📖 Academic Documentation

See the `documentation.html` file for a detailed explanation including:
- Graph theory fundamentals
- Traveling Salesman Problem (TSP)
- Computational complexity analysis
- System architecture
- Bibliographic references

## 🌟 Interface Features

- Minimalist and professional design
- Modern color palette (purple gradient)
- Responsive design for mobile and tablets
- Visual feedback in all interactions
- Detailed distance information
- Numbered markers with route order

## 🔄 Use Cases

- Courier and package delivery companies
- Food delivery services
- Merchandise distribution
- School bus routes
- Maintenance services
- Tourism itinerary planning

## 🌎 Bogotá, Colombia Examples

The system is pre-configured with Bogotá as the default location. Check `EXAMPLES.md` for specific routes in:
- Downtown Bogotá (Plaza de Bolívar, Museo del Oro)
- North Bogotá (Zona Rosa, Parque 93, Unicentro)
- Commercial districts (Shopping centers and main avenues)

## 📝 License

This project is developed for educational and demonstration purposes.

## 👨‍💻 Development

The system is fully implemented on the client side (frontend), with no need for a backend server. All calculations are performed in the user's browser.

---

Developed as an optimization system based on graph algorithms 🚀