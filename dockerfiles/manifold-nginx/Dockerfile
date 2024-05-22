FROM nginx:1.25

RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -y openssl

COPY dockerfiles/manifold-nginx/config/default.conf /etc/nginx/conf.d/default.conf

COPY dockerfiles/manifold-nginx/includes/manifold-client-local /etc/nginx/includes/manifold-client-local
COPY dockerfiles/manifold-nginx/includes/manifold-server-local /etc/nginx/includes/manifold-server-local

COPY dockerfiles/manifold-nginx/scripts/install-self-signed-cert /usr/local/bin/install-self-signed-cert
COPY dockerfiles/manifold-nginx/scripts/start-nginx /usr/local/bin/start-nginx

VOLUME ["/manifold_sockets","/manifold_data"]

EXPOSE 80 443
