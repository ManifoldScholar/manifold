#!/usr/bin/env puma

daemonize false
pidfile 'tmp/pids/puma.pid'
state_path 'tmp/pids/puma.state'
threads 0, 16
tag 'manifold-api'

if ENV['BOXEN_SOCKET_DIR']
  socket_path = "unix://#{ENV['BOXEN_SOCKET_DIR']}"
  the_environment = 'development'
else
  socket_path = "unix://#{ENV['APP_SOCKET_PATH']}"
  the_environment = 'production'
end

bind "#{socket_path}/manifold-api"
activate_control_app "#{socket_path}/manifold-api-control"
