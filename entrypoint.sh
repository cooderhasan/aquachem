#!/bin/sh

# Volume mount edildiğinde root'a ait olur, izinleri düzelt
mkdir -p /app/public/uploads
chmod -R 777 /app/public/uploads

echo "✅ Uploads klasörü hazır: /app/public/uploads"

# Warmup fonksiyonu - arka planda çalışır
warmup() {
  echo "⏳ Cache warmup bekleniyor..."
  # Sunucunun hazır olmasını bekle (max 60 saniye)
  for i in $(seq 1 60); do
    if wget -q --spider http://localhost:3000/tr 2>/dev/null; then
      echo "🔥 Sunucu hazır, cache ısıtılıyor..."
      # -T 10: her sayfa max 10 saniye beklensin
      wget -T 10 -q -O /dev/null http://localhost:3000/tr 2>/dev/null           && echo "  ✓ /tr"           || true
      wget -T 10 -q -O /dev/null http://localhost:3000/en 2>/dev/null           && echo "  ✓ /en"           || true
      wget -T 10 -q -O /dev/null http://localhost:3000/tr/products 2>/dev/null  && echo "  ✓ /tr/products"  || true
      wget -T 10 -q -O /dev/null http://localhost:3000/tr/corporate 2>/dev/null && echo "  ✓ /tr/corporate" || true
      wget -T 10 -q -O /dev/null http://localhost:3000/tr/references 2>/dev/null && echo "  ✓ /tr/references" || true
      wget -T 10 -q -O /dev/null http://localhost:3000/tr/contact 2>/dev/null   && echo "  ✓ /tr/contact"   || true
      wget -T 10 -q -O /dev/null http://localhost:3000/tr/certificates 2>/dev/null && echo "  ✓ /tr/certificates" || true
      wget -T 10 -q -O /dev/null http://localhost:3000/tr/news 2>/dev/null      && echo "  ✓ /tr/news"      || true
      echo "✅ Cache warmup tamamlandı! Sunucu trafiğe hazır."
      return 0
    fi
    sleep 1
  done
  echo "⚠️ Warmup timeout - sunucu 60 saniyede hazır olmadı"
}

# Warmup'ı ARKA PLANDA başlat (sunucu başlamayı engellemez)
warmup &

# Sunucuyu PID 1 olarak başlat (exec: crash olmaz, sinyaller düzgün iletilir)
exec node server.js
