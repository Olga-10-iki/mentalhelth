FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# Copy static site files to Nginx's public directory
COPY . /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 