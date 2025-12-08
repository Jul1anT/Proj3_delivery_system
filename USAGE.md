# Guía de Uso - Sistema Optimizador de Rutas

## 🚀 Inicio Rápido

### Opción 1: Abrir directamente en el navegador
1. Descarga o clona este repositorio
2. Abre `index.html` en tu navegador web preferido
3. ¡Listo! El sistema estará funcionando

### Opción 2: Usar un servidor HTTP local
Para una mejor experiencia, especialmente si tienes problemas con CORS:

```bash
# Con Python 3
python3 -m http.server 8080

# Con Node.js (si tienes http-server instalado)
npx http-server -p 8080

# Con PHP
php -S localhost:8080
```

Luego abre `http://localhost:8080` en tu navegador.

## 📍 Agregar Puntos de Entrega

### Método 1: Click en el Mapa
- Simplemente haz click en cualquier ubicación del mapa
- Se agregará automáticamente un punto de entrega en esa ubicación

### Método 2: Ingresar Coordenadas
1. En el campo "Dirección o coordenadas", ingresa las coordenadas en formato: `latitud, longitud`
2. Ejemplo: `19.4326, -99.1332`
3. Presiona "Agregar Punto" o Enter

### Método 3: Buscar Dirección
1. Escribe una dirección en el campo de texto
2. Ejemplo: "Torre Latinoamericana, Ciudad de México"
3. El sistema geocodificará la dirección automáticamente
4. Presiona "Agregar Punto" o Enter

## 🎯 Optimizar la Ruta

1. Agrega al menos 2 puntos de entrega
2. Haz click en el botón "🚀 Optimizar Ruta"
3. El sistema calculará la ruta más eficiente automáticamente
4. Verás:
   - La ruta trazada en el mapa con líneas verdes
   - Marcadores numerados indicando el orden de paradas
   - Flechas mostrando la dirección del recorrido
   - Panel con detalles de cada parada y distancias
   - Distancia total del recorrido

## 📱 Navegación GPS

### Para cada punto individual:
- Haz click en el botón "📍 GPS" junto al punto en la lista
- O haz click en un marcador del mapa y luego en "Abrir en Google Maps"
- Se abrirá Google Maps con:
  - La ubicación exacta del destino
  - Ruta desde tu ubicación actual (GPS)
  - Navegación paso a paso activada

## 🗑️ Gestión de Puntos

### Eliminar un punto:
- Haz click en el botón "✕" rojo junto al punto que deseas eliminar

### Limpiar todos los puntos:
- Haz click en "🗑️ Limpiar Todo"
- Confirma la acción en el diálogo que aparece

## 💡 Consejos y Mejores Prácticas

### Para mejores resultados:
1. **Cantidad de puntos**: El sistema funciona bien con 2-50 puntos. Para más puntos, considera dividir en múltiples rutas.
2. **Geocodificación**: Si buscas direcciones, sé específico incluyendo ciudad y país
3. **Coordenadas precisas**: Usa coordenadas exactas cuando sea posible para mayor precisión
4. **Zoom del mapa**: Ajusta el zoom para ver todos tus puntos cómodamente

### Limitaciones conocidas:
- El algoritmo del vecino más cercano proporciona una buena solución pero no garantiza la ruta óptima absoluta
- La geocodificación depende del servicio Nominatim de OpenStreetMap
- Se requiere conexión a internet para los mapas y geocodificación

## 🎨 Características de la Interfaz

- **Responsive**: Funciona en computadoras, tablets y móviles
- **Interactivo**: Arrastra el mapa, haz zoom, interactúa con marcadores
- **Visual**: Colores y numeración clara para seguir la ruta fácilmente
- **Informativo**: Distancias precisas entre cada parada

## 🧮 Algoritmo de Optimización

El sistema utiliza el **algoritmo del vecino más cercano** (Nearest Neighbor):
- Comienza en el primer punto agregado
- Encuentra el punto más cercano no visitado
- Se mueve a ese punto
- Repite hasta visitar todos los puntos
- Complejidad: O(n²) - muy rápido incluso con muchos puntos

Las distancias se calculan usando la **fórmula de Haversine**, que considera la curvatura de la Tierra para cálculos precisos.

## 📖 Documentación

Para más información sobre la teoría y algoritmos:
- Haz click en "📖 Ver Documentación Académica" en el pie de página
- O abre directamente `documentation.html`

## ⚙️ Requisitos Técnicos

### Navegador:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Conexión:
- Internet requerido para:
  - Tiles de OpenStreetMap
  - Geocodificación de direcciones
  - Integración con Google Maps

## 🐛 Solución de Problemas

### El mapa no se carga:
- Verifica tu conexión a internet
- Asegúrate de que tu navegador permite contenido externo (CDN)
- Prueba con otro navegador
- Revisa la consola del navegador para errores

### La geocodificación no funciona:
- Verifica que la dirección sea válida y específica
- Intenta agregar el país al final de la dirección
- Como alternativa, usa coordenadas directamente

### Google Maps no abre:
- Verifica que no estás bloqueando ventanas emergentes
- El botón abre una nueva pestaña con la ubicación

## 📞 Soporte

Este es un proyecto educativo y demostrativo. Para problemas:
1. Revisa esta documentación
2. Consulta `documentation.html` para detalles técnicos
3. Verifica la consola del navegador para errores

---

¡Disfruta optimizando tus rutas de entrega! 🚀📦
