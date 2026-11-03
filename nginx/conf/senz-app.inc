# shared location rules for http + https (included by default.conf)

# gzip
gzip on;
gzip_comp_level 5;
gzip_min_length 256;
gzip_proxied any;
gzip_types text/plain text/css application/json application/javascript application/xml image/svg+xml;

proxy_http_version 1.1;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";

# --- uploaded product images (served by the API, cached by nginx) ---
location /uploads/ {
  proxy_pass http://senz_api;
  proxy_cache_valid 200 30d;
  expires 30d;
  add_header Cache-Control "public, max-age=2592000";
}

# --- REST API ---
location /api/ {
  proxy_pass http://senz_api;
  proxy_read_timeout 60s;
  proxy_buffering off;
}

# --- Next.js static assets ---
location /_next/static/ {
  proxy_pass http://senz_web;
  expires 365d;
  add_header Cache-Control "public, max-age=31536000, immutable";
}

# --- everything else → Next.js ---
location / {
  proxy_pass http://senz_web;
  proxy_read_timeout 60s;
}

error_page 502 503 504 /50x.html;
location = /50x.html {
  return 503 '{"error":"سرویس موقتاً در دسترس نیست. لطفاً چند لحظه بعد تلاش کنید."}';
  add_header Content-Type application/json;
}
