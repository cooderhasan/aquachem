#!/bin/sh
set -e

# Volume mount edildiğinde root'a ait olur, izinleri düzelt
mkdir -p /app/public/uploads
chmod -R 777 /app/public/uploads

echo "✅ Uploads klasörü hazır: /app/public/uploads"

# Warmup fonksiyonu - arka planda çalışır
warmup() {
  echo "⏳ Cache warmup bekleniyor..."
  # Sunucunun hazır olmasını bekle (max 30 saniye)
  for i in $(seq 1 30); do
    if wget -q --spider http://localhost:3000/tr 2>/dev/null; then
      echo "🔥 Sunucu hazır, cache ısıtılıyor..."
      # Ana sayfaları ziyaret ederek cache'i doldur
      wget -q -O /dev/null http://localhost:3000/tr 2>/dev/null || true
      wget -q -O /dev/null http://localhost:3000/en 2>/dev/null || true
      wget -q -O /dev/null http://localhost:3000/tr/products 2>/dev/null || true
      wget -q -O /dev/null http://localhost:3000/tr/references 2>/dev/null || true
      wget -q -O /dev/null http://localhost:3000/tr/corporate 2>/dev/null || true
      wget -q -O /dev/null http://localhost:3000/tr/contact 2>/dev/null || true
      wget -q -O /dev/null http://localhost:3000/tr/certificates 2>/dev/null || true
      wget -q -O /dev/null http://localhost:3000/tr/news 2>/dev/null || true
      echo "✅ Cache warmup tamamlandı!"
      return 0
    fi
    sleep 1
  done
  echo "⚠️ Warmup timeout - sunucu 30 saniyede hazır olmadı"
}

# Warmup'ı arka planda başlat
warmup &

# Uygulamayı başlat
exec node server.js

