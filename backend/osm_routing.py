"""
OSMnx-based routing module for realistic street network navigation.

Provides functions to:
- Download and cache street graphs for geographic areas
- Calculate routes using actual street networks
- Compute realistic distances and travel times
- Generate distance matrices for optimization

Example usage:
    router = OSMRouter()
    router.initialize_graph(place_name="Manhattan, New York, USA")
    result = router.route_between_points([(40.7589, -73.9851), (40.7484, -73.9857)])
    print(f"Distance: {result['distance_km']} km, Time: {result['time_minutes']} min")
"""

import os
import logging
from typing import List, Tuple, Optional, Dict, Any
import osmnx as ox
import networkx as nx

# Configure OSMnx
ox.config(use_cache=True, log_console=False)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OSMRouter:
    """Router using OpenStreetMap street networks via OSMnx."""
    
    def __init__(self, cache_dir: str = "./osm_cache"):
        """
        Initialize router.
        
        Args:
            cache_dir: Directory to cache downloaded graphs
        """
        self.cache_dir = cache_dir
        self.graph = None
        os.makedirs(cache_dir, exist_ok=True)
        
    def initialize_graph(
        self,
        place_name: Optional[str] = None,
        bbox: Optional[Tuple[float, float, float, float]] = None,
        network_type: str = "drive",
        default_speed_kph: float = 30.0
    ) -> Dict[str, Any]:
        """
        Download and initialize street graph for an area.
        
        Args:
            place_name: Place name (e.g., "Manhattan, New York, USA")
            bbox: Bounding box as (north, south, east, west)
            network_type: 'drive', 'walk', 'bike', or 'all'
            default_speed_kph: Default speed for roads without speed data
            
        Returns:
            Dictionary with success status, node/edge counts, and cached flag
        """
        try:
            # Generate cache filename
            if place_name:
                cache_name = f"{place_name.replace(', ', '_').replace(' ', '_')}_{network_type}.graphml"
            elif bbox:
                cache_name = f"bbox_{bbox[0]}_{bbox[1]}_{bbox[2]}_{bbox[3]}_{network_type}.graphml"
            else:
                return {"success": False, "error": "Must provide place_name or bbox"}
            
            cache_path = os.path.join(self.cache_dir, cache_name)
            
            # Try to load from cache
            if os.path.exists(cache_path):
                logger.info(f"Loading graph from cache: {cache_path}")
                self.graph = ox.load_graphml(cache_path)
                cached = True
            else:
                # Download graph
                logger.info(f"Downloading graph for {place_name or bbox}")
                if place_name:
                    self.graph = ox.graph_from_place(
                        place_name, 
                        network_type=network_type,
                        simplify=True
                    )
                elif bbox:
                    north, south, east, west = bbox
                    self.graph = ox.graph_from_bbox(
                        north, south, east, west,
                        network_type=network_type,
                        simplify=True
                    )
                
                # Add speeds and travel times
                logger.info("Adding edge speeds and travel times")
                self.graph = self._add_edge_attributes(self.graph, default_speed_kph)
                
                # Save to cache
                logger.info(f"Saving graph to cache: {cache_path}")
                ox.save_graphml(self.graph, cache_path)
                cached = False
            
            num_nodes = len(self.graph.nodes)
            num_edges = len(self.graph.edges)
            
            logger.info(f"Graph initialized: {num_nodes} nodes, {num_edges} edges")
            
            return {
                "success": True,
                "nodes": num_nodes,
                "edges": num_edges,
                "cached": cached
            }
            
        except Exception as e:
            logger.error(f"Error initializing graph: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def _add_edge_attributes(self, G: nx.MultiDiGraph, default_speed_kph: float) -> nx.MultiDiGraph:
        """Add speed and travel time attributes to graph edges."""
        try:
            # Add edge speeds
            G = ox.add_edge_speeds(G)
        except Exception:
            # Fallback: set default speed for all edges
            for u, v, k, data in G.edges(keys=True, data=True):
                if "speed_kph" not in data:
                    data["speed_kph"] = default_speed_kph
        
        try:
            # Add travel times (in seconds)
            G = ox.add_edge_travel_times(G)
        except Exception:
            # Fallback: calculate manually
            for u, v, k, data in G.edges(keys=True, data=True):
                length_m = data.get("length", 0.0)
                speed_kph = data.get("speed_kph", default_speed_kph)
                if speed_kph <= 0:
                    speed_kph = default_speed_kph
                # time = distance / speed (convert to seconds)
                travel_time_s = (length_m / 1000.0) / (speed_kph / 3600.0)
                data["travel_time"] = travel_time_s
        
        return G
    
    def nearest_node(self, point: Tuple[float, float]) -> Optional[int]:
        """
        Find nearest graph node to a point.
        
        Args:
            point: (lat, lon) tuple
            
        Returns:
            Node ID or None if graph not initialized
        """
        if self.graph is None:
            return None
        
        lat, lon = point
        return ox.distance.nearest_nodes(self.graph, X=lon, Y=lat)
    
    def route_between_points(
        self,
        points: List[Tuple[float, float]],
        weight: str = "travel_time"
    ) -> Dict[str, Any]:
        """
        Calculate route through multiple points.
        
        Args:
            points: List of (lat, lon) tuples
            weight: Edge attribute to minimize ('travel_time' or 'length')
            
        Returns:
            Dictionary with route details including coordinates, distance, and time
        """
        try:
            if self.graph is None:
                return {"success": False, "error": "Graph not initialized"}
            
            if len(points) < 2:
                return {"success": False, "error": "Need at least 2 points"}
            
            # Map points to nearest nodes
            node_ids = [self.nearest_node(p) for p in points]
            
            # Calculate route through all points
            full_route = []
            total_distance_m = 0.0
            total_time_s = 0.0
            
            for i in range(len(node_ids) - 1):
                origin = node_ids[i]
                dest = node_ids[i + 1]
                
                try:
                    # Find shortest path
                    segment = nx.shortest_path(self.graph, origin, dest, weight=weight)
                    
                    # Add to route (avoid duplicating intermediate nodes)
                    if i == 0:
                        full_route.extend(segment)
                    else:
                        full_route.extend(segment[1:])
                    
                    # Calculate segment distance and time
                    for j in range(len(segment) - 1):
                        u, v = segment[j], segment[j + 1]
                        edge_data = self.graph.get_edge_data(u, v)
                        if edge_data:
                            # Get minimum length/time across parallel edges
                            min_length = min(d.get("length", 0) for d in edge_data.values())
                            min_time = min(d.get("travel_time", 0) for d in edge_data.values())
                            total_distance_m += min_length
                            total_time_s += min_time
                            
                except nx.NetworkXNoPath:
                    return {
                        "success": False,
                        "error": f"No path found between points {i} and {i+1}"
                    }
            
            # Get coordinates for route
            route_coords = [
                (self.graph.nodes[node]['y'], self.graph.nodes[node]['x'])
                for node in full_route
            ]
            
            return {
                "success": True,
                "route_coords": route_coords,
                "distance_m": total_distance_m,
                "distance_km": total_distance_m / 1000.0,
                "time_seconds": total_time_s,
                "time_minutes": total_time_s / 60.0,
                "num_nodes": len(full_route)
            }
            
        except Exception as e:
            logger.error(f"Error calculating route: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def calculate_distance_matrix(
        self,
        points: List[Tuple[float, float]],
        weight: str = "travel_time"
    ) -> Dict[str, Any]:
        """
        Calculate distance/time matrix between all pairs of points.
        
        Args:
            points: List of (lat, lon) tuples
            weight: Edge attribute to use ('travel_time' or 'length')
            
        Returns:
            Dictionary with distance and time matrices
        """
        try:
            if self.graph is None:
                return {"success": False, "error": "Graph not initialized"}
            
            n = len(points)
            distance_matrix = [[0.0] * n for _ in range(n)]
            time_matrix = [[0.0] * n for _ in range(n)]
            
            # Map all points to nodes
            node_ids = [self.nearest_node(p) for p in points]
            
            # Calculate distances between all pairs
            for i in range(n):
                for j in range(n):
                    if i == j:
                        continue
                    
                    try:
                        # Find shortest path
                        path = nx.shortest_path(
                            self.graph, 
                            node_ids[i], 
                            node_ids[j], 
                            weight=weight
                        )
                        
                        # Sum distances and times
                        distance = 0.0
                        time = 0.0
                        for k in range(len(path) - 1):
                            u, v = path[k], path[k + 1]
                            edge_data = self.graph.get_edge_data(u, v)
                            if edge_data:
                                min_length = min(d.get("length", 0) for d in edge_data.values())
                                min_time = min(d.get("travel_time", 0) for d in edge_data.values())
                                distance += min_length
                                time += min_time
                        
                        distance_matrix[i][j] = distance / 1000.0  # Convert to km
                        time_matrix[i][j] = time / 60.0  # Convert to minutes
                        
                    except nx.NetworkXNoPath:
                        distance_matrix[i][j] = float('inf')
                        time_matrix[i][j] = float('inf')
            
            return {
                "success": True,
                "distance_matrix": distance_matrix,
                "time_matrix": time_matrix
            }
            
        except Exception as e:
            logger.error(f"Error calculating distance matrix: {str(e)}")
            return {"success": False, "error": str(e)}


# Example usage
if __name__ == "__main__":
    # Example: Route in Manhattan
    router = OSMRouter()
    
    print("Initializing graph for Manhattan...")
    result = router.initialize_graph(place_name="Manhattan, New York, USA")
    print(f"Graph initialized: {result}")
    
    if result["success"]:
        # Example points in Manhattan
        points = [
            (40.7589, -73.9851),  # Times Square
            (40.7484, -73.9857),  # Empire State Building
            (40.7614, -73.9776)   # Central Park
        ]
        
        print("\nCalculating route...")
        route_result = router.route_between_points(points)
        
        if route_result["success"]:
            print(f"Distance: {route_result['distance_km']:.2f} km")
            print(f"Time: {route_result['time_minutes']:.2f} minutes")
            print(f"Route has {route_result['num_nodes']} nodes")
        else:
            print(f"Error: {route_result['error']}")
