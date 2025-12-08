# Sistema Optimizador de Rutas de Entrega 📦

Sistema web interactivo para la optimización de rutas de entrega basado en teoría de grafos y algoritmos heurísticos.

## 🚀 Características

- **Mapa Interactivo**: Visualiza todos los puntos de entrega en un mapa usando Leaflet.js
- **Optimización Inteligente**: Calcula la ruta más eficiente usando el algoritmo del vecino más cercano (Nearest Neighbor)
- **Orden de Paradas**: Muestra la secuencia óptima de entregas con distancias entre paradas
- **Integración GPS**: Botón para abrir cada destino en Google Maps con navegación activada
- **Interfaz Moderna**: Diseño minimalista y fácil de usar
- **Documentación Académica**: Explicación completa del modelo matemático y algoritmos

## 📋 Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet (para cargar mapas y servicios de geocodificación)

## 🎯 Cómo Usar

1. Abre el archivo `index.html` en tu navegador web
2. Agrega puntos de entrega de tres formas:
   - Haciendo clic directamente en el mapa
   - Ingresando coordenadas (formato: lat, lng)
   - Escribiendo una dirección para búsqueda automática
3. Haz clic en "Optimizar Ruta" para calcular la mejor ruta
4. Visualiza la ruta óptima con el orden sugerido de paradas
5. Usa el botón "📍 GPS" para abrir cada destino en Google Maps

## 🧮 Tecnología y Algoritmos

### Teoría de Grafos
El sistema modela el problema de rutas como un grafo completo ponderado:
- **Nodos**: Puntos de entrega con coordenadas geográficas
- **Aristas**: Conexiones entre puntos con distancia como peso
- **Objetivo**: Encontrar el camino más corto que visita todos los nodos

### Algoritmo del Vecino Más Cercano
Heurística greedy con complejidad O(n²) que:
1. Inicia en un punto arbitrario
2. Selecciona el punto no visitado más cercano
3. Repite hasta visitar todos los puntos
4. Proporciona soluciones aproximadas en tiempo real

### Fórmula de Haversine
Calcula distancias reales considerando la curvatura de la Tierra:
```
a = sin²(Δφ/2) + cos(φ₁) × cos(φ₂) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1-a))
d = R × c
```

## 📂 Estructura del Proyecto

```
delivery_system/
├── index.html           # Página principal de la aplicación
├── app.js              # Lógica de optimización y manejo del mapa
├── styles.css          # Estilos modernos y responsivos
├── documentation.html  # Documentación académica completa
└── README.md          # Este archivo
```

## 🎨 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno con gradientes y animaciones
- **JavaScript ES6+**: Lógica de la aplicación
- **Leaflet.js**: Mapas interactivos
- **OpenStreetMap**: Datos cartográficos
- **Nominatim**: Servicio de geocodificación
- **Google Maps API**: Navegación GPS

## 📖 Documentación Académica

Consulta el archivo `documentation.html` para una explicación detallada que incluye:
- Fundamentos de teoría de grafos
- Problema del Viajante (TSP)
- Análisis de complejidad computacional
- Arquitectura del sistema
- Referencias bibliográficas

## 🌟 Características de la Interfaz

- Diseño minimalista y profesional
- Paleta de colores moderna (gradiente púrpura)
- Responsive design para móviles y tablets
- Feedback visual en todas las interacciones
- Información detallada de distancias
- Marcadores numerados con orden de ruta

## 🔄 Casos de Uso

- Empresas de mensajería y paquetería
- Servicios de entrega de alimentos
- Distribución de mercancías
- Rutas de transporte escolar
- Servicios de mantenimiento
- Planificación de itinerarios turísticos

## 📝 Licencia

Este proyecto está desarrollado con fines educativos y demostrativos.

## 👨‍💻 Desarrollo

El sistema está implementado completamente en el lado del cliente (frontend), sin necesidad de servidor backend. Todos los cálculos se realizan en el navegador del usuario.

---

Desarrollado como sistema de optimización basado en algoritmos de grafos 🚀