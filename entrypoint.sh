#!/bin/sh

# Volume mount edildiğinde root'a ait olur, izinleri düzelt
mkdir -p /app/public/uploads
chmod -R 777 /app/public/uploads

echo "✅ Uploads klasörü hazır: /app/public/uploads"

# Warmup fonksiyonu - arka planda çalışır
warmup() {
  echo "⏳ Cache warmup bekleniyor..."

  # Önce /api/health endpoint'i ile sunucunun ayakta olduğunu kontrol et
  # Bu endpoint DB sorgusu yapmaz, anında cevap verir
  for i in $(seq 1 90); do
    if wget -T 3 -q -O /dev/null http://localhost:3000/api/health 2>/dev/null; then
      echo "🔥 Sunucu hazır! Sayfalar ısıtılıyor..."
      break
    fi
    sleep 1
  done

  # Asıl sayfaları ısıt (DB cache dolsun) - her biri max 30s
  wget -T 30 -q -O /dev/null http://localhost:3000/tr 2>/dev/null           && echo "  ✓ /tr"           || echo "  ⚠ /tr skip"
  wget -T 30 -q -O /dev/null http://localhost:3000/en 2>/dev/null           && echo "  ✓ /en"           || echo "  ⚠ /en skip"
  wget -T 30 -q -O /dev/null http://localhost:3000/tr/products 2>/dev/null  && echo "  ✓ /tr/products"  || echo "  ⚠ /tr/products skip"
  wget -T 30 -q -O /dev/null http://localhost:3000/tr/corporate 2>/dev/null && echo "  ✓ /tr/corporate" || echo "  ⚠ /tr/corporate skip"
  wget -T 30 -q -O /dev/null http://localhost:3000/tr/references 2>/dev/null && echo "  ✓ /tr/references" || echo "  ⚠ /tr/references skip"
  wget -T 30 -q -O /dev/null http://localhost:3000/tr/contact 2>/dev/null   && echo "  ✓ /tr/contact"   || echo "  ⚠ /tr/contact skip"
  wget -T 30 -q -O /dev/null http://localhost:3000/tr/certificates 2>/dev/null && echo "  ✓ /tr/certificates" || echo "  ⚠ /tr/certificates skip"
  wget -T 30 -q -O /dev/null http://localhost:3000/tr/news 2>/dev/null      && echo "  ✓ /tr/news"      || echo "  ⚠ /tr/news skip"

  echo "✅ Cache warmup tamamlandı!"
}

# Warmup'ı ARKA PLANDA başlat (sunucu başlamayı engellemez)
warmup &

# Sunucuyu PID 1 olarak başlat (exec: sinyaller düzgün iletilir)
exec node server.js
