#!/bin/sh
set -e

# Volume mount edildiğinde root'a ait olur, izinleri düzelt
mkdir -p /app/public/uploads
chmod -R 777 /app/public/uploads

echo "✅ Uploads klasörü hazır: /app/public/uploads"

# Uygulamayı ARKA PLANDA başlat (PID'ini kaydet)
node server.js &
SERVER_PID=$!

echo "⏳ Sunucu başlatılıyor (PID: $SERVER_PID)..."

# Sunucunun hazır olmasını bekle (max 60 saniye)
READY=0
for i in $(seq 1 60); do
  if wget -q --spider http://localhost:3000/tr 2>/dev/null; then
    READY=1
    break
  fi
  echo "   Bekleniyor... ($i/60)"
  sleep 1
done

if [ "$READY" = "1" ]; then
  echo "🔥 Sunucu hazır! Cache ısıtılıyor..."

  # Tüm kritik sayfaları sırayla ziyaret et (cache dolsun)
  wget -q -O /dev/null http://localhost:3000/tr 2>/dev/null           && echo "  ✓ /tr"           || true
  wget -q -O /dev/null http://localhost:3000/en 2>/dev/null           && echo "  ✓ /en"           || true
  wget -q -O /dev/null http://localhost:3000/tr/products 2>/dev/null  && echo "  ✓ /tr/products"  || true
  wget -q -O /dev/null http://localhost:3000/tr/corporate 2>/dev/null && echo "  ✓ /tr/corporate" || true
  wget -q -O /dev/null http://localhost:3000/tr/references 2>/dev/null && echo "  ✓ /tr/references" || true
  wget -q -O /dev/null http://localhost:3000/tr/contact 2>/dev/null   && echo "  ✓ /tr/contact"   || true
  wget -q -O /dev/null http://localhost:3000/tr/certificates 2>/dev/null && echo "  ✓ /tr/certificates" || true
  wget -q -O /dev/null http://localhost:3000/tr/news 2>/dev/null      && echo "  ✓ /tr/news"      || true

  echo "✅ Cache warmup tamamlandı! Sunucu trafiğe hazır."
else
  echo "⚠️ Warmup timeout - sunucu 60 saniyede hazır olmadı. Yine de devam ediliyor."
fi

# Sunucu process'ini ön plana al (container canlı kalsın)
wait $SERVER_PID
