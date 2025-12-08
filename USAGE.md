# Usage Guide - Route Optimizer System

## 🚀 Quick Start

### Option 1: Open directly in browser
1. Download or clone this repository
2. Open `index.html` in your preferred web browser
3. Ready! The system will be running

### Option 2: Use a local HTTP server
For a better experience, especially if you have CORS issues:

```bash
# With Python 3
python3 -m http.server 8080

# With Node.js (if you have http-server installed)
npx http-server -p 8080

# With PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

## 📍 Adding Delivery Points

### Method 1: Search Address (NEW! with Autocomplete)
1. Start typing an address in the search field
2. **Smart autocomplete**: After typing 3 characters, suggestions will appear automatically
3. Search examples:
   - By street: "Carrera 7"
   - By landmark: "Plaza de Bolivar"
   - By city: "Bogota"
   - By postal code: "110111"
4. **Navigate suggestions**:
   - Use arrow keys ↑ ↓ to move between suggestions
   - Click on any suggestion to select it
   - Press Enter to select the highlighted suggestion
   - Press Esc to close suggestions
5. The selected address will be automatically added to the map

### Method 2: Click on Map
- Simply click on any location on the map
- A delivery point will be automatically added at that location

### Method 3: Enter Coordinates
1. In the search field, enter coordinates in format: `latitude, longitude`
2. Example: `4.7110, -74.0721`
3. Press "Add Point" or Enter

## 🎯 Optimizing the Route

1. Add at least 2 delivery points
2. Click the "🚀 Optimize Route" button
3. The system will automatically calculate the most efficient route
4. You will see:
   - The route drawn on the map with green lines
   - Numbered markers indicating the stop order
   - Arrows showing the direction of travel
   - Panel with details of each stop and distances
   - Total distance of the route

## 📱 GPS Navigation

### For each individual point:
- Click the "📍 GPS" button next to the point in the list
- Or click on a map marker and then "Open in Google Maps"
- Google Maps will open with:
  - The exact location of the destination
  - Route from your current location (GPS)
  - Step-by-step navigation enabled

## 🗑️ Point Management

### Remove a point:
- Click the red "✕" button next to the point you want to remove

### Clear all points:
- Click "🗑️ Clear All"
- Confirm the action in the dialog that appears

## 💡 Tips and Best Practices

### For best results:
1. **Number of points**: The system works well with 2-50 points. For more points, consider splitting into multiple routes.
2. **Geocoding**: If searching for addresses, be specific including city and country
3. **Precise coordinates**: Use exact coordinates when possible for greater accuracy
4. **Map zoom**: Adjust zoom to see all your points comfortably

### Known limitations:
- The Nearest Neighbor algorithm provides a good solution but does not guarantee the absolute optimal route
- Geocoding depends on OpenStreetMap's Nominatim service
- Internet connection required for maps and geocoding

## 🌎 Bogotá, Colombia Examples

### Downtown Bogotá Route:
1. Plaza de Bolívar: `4.5981, -74.0758`
2. Museo del Oro: `4.6017, -74.0720`
3. Monserrate: `4.6055, -74.0565`

### North Bogotá Route:
1. Zona Rosa: `4.6653, -74.0529`
2. Parque 93: `4.6756, -74.0487`
3. Centro Andino: `4.6728, -74.0470`
4. Unicentro: `4.6883, -74.0480`

Or simply search: "Zona Rosa, Bogota" and select from suggestions!

## 🎨 Interface Features

- **Responsive**: Works on computers, tablets and mobiles
- **Interactive**: Drag the map, zoom, interact with markers
- **Visual**: Clear colors and numbering to follow the route easily
- **Informative**: Precise distances between each stop

## 🧮 Optimization Algorithm

The system uses the **Nearest Neighbor algorithm**:
- Starts at the first added point
- Finds the nearest unvisited point
- Moves to that point
- Repeats until all points are visited
- Complexity: O(n²) - very fast even with many points

Distances are calculated using the **Haversine formula**, which considers Earth's curvature for accurate calculations.

## 📖 Documentation

For more information about the theory and algorithms:
- Click "📖 View Academic Documentation" in the footer
- Or open `documentation.html` directly

## ⚙️ Technical Requirements

### Browser:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Connection:
- Internet required for:
  - OpenStreetMap tiles
  - Address geocoding
  - Google Maps integration

## 🐛 Troubleshooting

### Map doesn't load:
- Check your internet connection
- Make sure your browser allows external content (CDN)
- Try another browser
- Check browser console for errors

### Geocoding doesn't work:
- Verify the address is valid and specific
- Try adding the country at the end of the address
- As an alternative, use coordinates directly

### Google Maps doesn't open:
- Check that you're not blocking pop-ups
- The button opens a new tab with the location

## 📞 Support

This is an educational and demonstration project. For problems:
1. Review this documentation
2. Consult `documentation.html` for technical details
3. Check the browser console for errors

---

Enjoy optimizing your delivery routes! 🚀📦
