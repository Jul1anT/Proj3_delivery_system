# OSMnx Routing Backend

This backend provides realistic street-based routing using OpenStreetMap data via OSMnx.

## Features

- 🗺️ **Real street networks** - Downloads actual road networks from OpenStreetMap
- 🚗 **Realistic routing** - Routes follow actual streets, respecting one-way roads and connectivity
- ⚡ **Fast caching** - Downloads graphs once, then reuses them instantly
- 🌍 **Global coverage** - Works anywhere in the world
- 📊 **Distance matrices** - Calculates pairwise distances for route optimization
- ⏱️ **Travel time estimates** - Based on road types and speed limits

## Installation

### Option 1: Using pip (requires system GDAL/GEOS libraries)

```bash
cd backend
pip install -r requirements.txt
```

### Option 2: Using conda (recommended - includes all dependencies)

```bash
conda create -n delivery-routing python=3.10
conda activate delivery-routing
conda install -c conda-forge osmnx geopandas flask flask-cors
```

## Running the Server

```bash
python routing_server.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### 1. Health Check

```bash
GET /api/health
```

### 2. Initialize Graph

Download and cache the street network for a geographic area.

```bash
POST /api/initialize_graph
Content-Type: application/json

{
  "place_name": "Bogotá, Colombia",
  "network_type": "drive",
  "default_speed_kph": 30.0
}
```

### 3. Calculate Route

Compute a route through multiple waypoints using the street network.

```bash
POST /api/route
Content-Type: application/json

{
  "points": [[4.7110, -74.0721], [4.6097, -74.0817]],
  "weight": "travel_time"
}
```

### 4. Distance Matrix

Calculate pairwise distances and travel times between all points.

```bash
POST /api/distance_matrix
```