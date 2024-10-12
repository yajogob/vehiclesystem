FROM nginx:1.22.1 AS build
EXPOSE 80
COPY conf/default.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY dist/vehicle-system /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
