FROM nginx:alpine

COPY ./docker/Dockerfiles/manifold_proxy/config/default.conf /etc/nginx/conf.d/default.conf

VOLUME ["/manifold_sockets","/manifold_data"]

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
