#!/bin/bash
# Script para iniciar el servidor accesible en la red local

echo "🚀 Iniciando Delivery Route Optimizer (Red Local)..."
echo ""

# Obtener la IP local
IP=$(hostname -I | awk '{print $1}')

echo "📍 Acceso local:     http://localhost:8000"
echo "🌐 Acceso en red:    http://$IP:8000"
echo ""
echo "⚠️  Comparte la URL de red con tu profesor si están en la MISMA red WiFi"
echo "⏹️  Presiona Ctrl+C para detener el servidor"
echo ""

python3 -m http.server 8000 --bind 0.0.0.0
