#!/bin/bash
# Script para iniciar el servidor del proyecto
echo "🚀 Iniciando Delivery Route Optimizer..."
echo "📍 Servidor disponible en: http://localhost:8000"
echo "⏹️  Presiona Ctrl+C para detener el servidor"
echo ""
python3 -m http.server 8000
