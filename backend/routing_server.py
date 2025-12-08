"""
Flask API server for OSMnx-based routing.

Provides REST API endpoints for:
- Initializing street network graphs
- Calculating routes between points
- Computing distance matrices

Run with: python routing_server.py
API will be available at http://localhost:5000
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from osm_routing import OSMRouter
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global router instance
router = OSMRouter()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "OSMnx Routing API",
        "graph_initialized": router.graph is not None
    })


@app.route('/api/initialize_graph', methods=['POST'])
def initialize_graph():
    """
    Initialize street graph for a geographic area.
    
    Request body:
        {
            "place_name": "Manhattan, New York, USA",  // OR
            "bbox": [40.8, 40.7, -73.9, -74.0],       // [north, south, east, west]
            "network_type": "drive",                   // optional: drive, walk, bike, all
            "default_speed_kph": 30.0                  // optional
        }
    
    Returns:
        {
            "success": true/false,
            "nodes": <number>,
            "edges": <number>,
            "cached": true/false,
            "error": "<error message if failed>"
        }
    """
    try:
        data = request.json
        
        place_name = data.get('place_name')
        bbox = data.get('bbox')
        network_type = data.get('network_type', 'drive')
        default_speed_kph = data.get('default_speed_kph', 30.0)
        
        if not place_name and not bbox:
            return jsonify({
                "success": False,
                "error": "Must provide either place_name or bbox"
            }), 400
        
        logger.info(f"Initializing graph for {place_name or bbox}")
        
        result = router.initialize_graph(
            place_name=place_name,
            bbox=bbox,
            network_type=network_type,
            default_speed_kph=default_speed_kph
        )
        
        status_code = 200 if result.get("success") else 500
        return jsonify(result), status_code
        
    except Exception as e:
        logger.error(f"Error initializing graph: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/route', methods=['POST'])
def calculate_route():
    """
    Calculate route through multiple points using street network.
    
    Request body:
        {
            "points": [[lat1, lon1], [lat2, lon2], ...],
            "weight": "travel_time"  // optional: travel_time or length
        }
    
    Returns:
        {
            "success": true/false,
            "route_coords": [[lat, lon], ...],
            "distance_km": <float>,
            "distance_m": <float>,
            "time_seconds": <float>,
            "time_minutes": <float>,
            "num_nodes": <int>,
            "error": "<error message if failed>"
        }
    """
    try:
        data = request.json
        
        points = data.get('points', [])
        weight = data.get('weight', 'travel_time')
        
        if len(points) < 2:
            return jsonify({
                "success": False,
                "error": "Need at least 2 points"
            }), 400
        
        # Convert to tuples
        points = [tuple(p) for p in points]
        
        logger.info(f"Calculating route through {len(points)} points")
        
        result = router.route_between_points(points, weight=weight)
        
        status_code = 200 if result.get("success") else 500
        return jsonify(result), status_code
        
    except Exception as e:
        logger.error(f"Error calculating route: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/distance_matrix', methods=['POST'])
def calculate_distance_matrix():
    """
    Calculate distance/time matrix between all pairs of points.
    
    Request body:
        {
            "points": [[lat1, lon1], [lat2, lon2], ...],
            "weight": "travel_time"  // optional
        }
    
    Returns:
        {
            "success": true/false,
            "distance_matrix": [[...], ...],  // km
            "time_matrix": [[...], ...],      // minutes
            "error": "<error message if failed>"
        }
    """
    try:
        data = request.json
        
        points = data.get('points', [])
        weight = data.get('weight', 'travel_time')
        
        if len(points) < 2:
            return jsonify({
                "success": False,
                "error": "Need at least 2 points"
            }), 400
        
        # Convert to tuples
        points = [tuple(p) for p in points]
        
        logger.info(f"Calculating distance matrix for {len(points)} points")
        
        result = router.calculate_distance_matrix(points, weight=weight)
        
        status_code = 200 if result.get("success") else 500
        return jsonify(result), status_code
        
    except Exception as e:
        logger.error(f"Error calculating distance matrix: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == '__main__':
    logger.info("Starting OSMnx Routing API server...")
    logger.info("API will be available at http://localhost:5000")
    logger.info("Endpoints:")
    logger.info("  GET  /api/health")
    logger.info("  POST /api/initialize_graph")
    logger.info("  POST /api/route")
    logger.info("  POST /api/distance_matrix")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
