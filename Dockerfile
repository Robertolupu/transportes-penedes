FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html ./
COPY styles.css ./
COPY app.js ./
COPY favicon.ico ./
COPY favicon.png ./
COPY apple-touch-icon.png ./
COPY favicon-v4.ico ./
COPY favicon-v4.png ./
COPY apple-touch-icon-v4.png ./
COPY archive ./archive

EXPOSE 80
