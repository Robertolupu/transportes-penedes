FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html ./
COPY styles.css ./
COPY app.js ./
COPY favicon.ico ./
COPY archive ./archive

EXPOSE 80
