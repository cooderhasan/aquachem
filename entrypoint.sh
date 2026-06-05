#!/bin/sh
set -e

# Volume mount edildiğinde root'a ait olur, izinleri düzelt
mkdir -p /app/public/uploads
chmod -R 777 /app/public/uploads

echo "✅ Uploads klasörü hazır: /app/public/uploads"

# Uygulamayı başlat
exec node server.js
