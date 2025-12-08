# Ejemplos de Uso

## Ejemplo 1: Ruta de Entrega en Ciudad de México

### Puntos de Entrega:
1. Torre Latinoamericana: `19.4338, -99.1407`
2. Ángel de la Independencia: `19.4270, -99.1677`
3. Palacio de Bellas Artes: `19.4352, -99.1412`
4. Zócalo: `19.4326, -99.1332`
5. Basílica de Guadalupe: `19.4847, -99.1175`

### Pasos:
1. Copia y pega cada coordenada en el campo de entrada
2. Presiona "Agregar Punto" después de cada una
3. Haz clic en "Optimizar Ruta"
4. Observa la ruta calculada y las distancias

### Resultado Esperado:
- Ruta óptima con aproximadamente 25-30 km total
- 5 paradas numeradas en orden eficiente
- Flechas direccionales mostrando el camino

## Ejemplo 2: Entregas en Nueva York

### Usando Direcciones:
1. Times Square, New York
2. Central Park, New York
3. Brooklyn Bridge, New York
4. Statue of Liberty, New York

### Pasos:
1. Escribe cada dirección en el campo
2. El sistema geocodificará automáticamente
3. Optimiza la ruta
4. Usa los botones GPS para navegación

## Ejemplo 3: Ruta Pequeña (2-3 puntos)

### Para pruebas rápidas:
1. `40.7580, -73.9855` (Times Square)
2. `40.7829, -73.9654` (Central Park)
3. `40.7061, -74.0087` (Brooklyn)

### Ideal para:
- Verificar funcionamiento básico
- Probar la interfaz
- Demostración rápida

## Ejemplo 4: Ruta Compleja (10+ puntos)

### Puntos aleatorios en Madrid:
```
40.4168, -3.7038  (Puerta del Sol)
40.4237, -3.6926  (Parque del Retiro)
40.4167, -3.7038  (Plaza Mayor)
40.4378, -3.6795  (Estadio Santiago Bernabéu)
40.4093, -3.6919  (Museo del Prado)
40.4165, -3.7026  (Plaza de España)
40.4381, -3.6740  (AZCA)
40.4473, -3.6826  (Cuatro Torres)
40.3915, -3.6976  (Planetario)
40.4400, -3.6800  (Plaza Castilla)
```

### Pasos:
1. Agrega todos los puntos
2. Optimiza la ruta
3. Observa cómo el algoritmo organiza las paradas
4. Nota la distancia total calculada

## Ejemplo 5: Click en el Mapa

### Método interactivo:
1. Haz zoom en tu ciudad favorita
2. Haz click en diferentes ubicaciones del mapa
3. Los puntos se agregarán automáticamente
4. Optimiza cuando tengas suficientes puntos

### Ventajas:
- No necesitas buscar coordenadas
- Visual e intuitivo
- Rápido para crear rutas

## Ejemplo 6: Ruta Internacional (Ciudades Europeas)

### Coordenadas:
```
48.8566, 2.3522   (París)
51.5074, -0.1278  (Londres)
52.5200, 13.4050  (Berlín)
41.9028, 12.4964  (Roma)
40.4168, -3.7038  (Madrid)
```

### Nota:
- Las distancias serán muy grandes
- Útil para demostración conceptual
- En práctica real, usa rutas más localizadas

## Consejos para Mejores Resultados

### 1. Puntos Cercanos
- Para rutas reales, usa puntos en la misma ciudad o región
- Distancias menores = cálculos más precisos

### 2. Cantidad Óptima
- 5-20 puntos es ideal para la mayoría de casos
- 2-4 puntos: ruta muy simple
- 20-50 puntos: aún manejable
- 50+ puntos: considera dividir en múltiples rutas

### 3. Precisión de Coordenadas
- Usa al menos 4 decimales: `19.4326, -99.1332`
- Más decimales = más precisión

### 4. Geocodificación
- Sé específico: "Torre Eiffel, París, Francia"
- Incluye ciudad y país cuando sea posible
- Verifica que la ubicación sea correcta en el mapa

### 5. Navegación GPS
- Usa los botones GPS cuando estés listo para ir
- Google Maps se abrirá con la ruta desde tu ubicación
- Funciona mejor en dispositivos móviles

## Casos de Uso Reales

### Mensajería:
```
# Ruta matutina de entregas
9:00 - Punto A (Centro)
9:20 - Punto B (Norte)
9:40 - Punto C (Noreste)
10:00 - Punto D (Este)
...
```

### Servicios de Comida:
- Restaurante (punto de partida)
- 5-10 direcciones de entrega
- Optimizar para minimizar tiempo
- Usar GPS para navegación en tiempo real

### Mantenimiento:
- Oficina central
- Múltiples sitios de clientes
- Optimizar para reducir kilometraje
- Guardar información de distancias

## Problemas Comunes y Soluciones

### "No encuentra mi dirección"
- **Solución**: Usa coordenadas directamente
- Obtén coordenadas de Google Maps: click derecho → coordenadas

### "La ruta no parece óptima"
- **Nota**: El algoritmo es heurístico, no siempre es perfecto
- Para mejores resultados, usa puntos bien distribuidos

### "Muchos puntos, cálculo lento"
- **Solución**: Divide en rutas más pequeñas
- El sistema funciona mejor con 5-30 puntos

---

¡Experimenta con estos ejemplos y descubre el poder de la optimización de rutas! 🚀
