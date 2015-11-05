#!/usr/bin/env puma

daemonize false
pidfile "tmp/pids/puma.pid"
state_path "tmp/pids/puma.state"
threads 0, 16
tag "manifold-api"
environment "development"

name = "manifold-api"

if ENV["BOXEN_SOCKET_DIR"]
  socket_dir = "unix://#{ENV['BOXEN_SOCKET_DIR']}"
  socket_path = "#{socket_dir}/#{name}"
elsif ENV["APP_SOCKET_DIR"]
  socket_dir  = "unix://#{ENV['APP_SOCKET_PATH']}"
  socket_path = "#{socket_dir}/#{name}"
else
  socket_dir = "unix://#{ENV['RAILS_SERVER_SOCKET_DIR']}"
  socket_path = "unix://#{ENV['RAILS_SERVER_SOCKET_PATH']}"
end

bind socket_path
activate_control_app "#{socket_dir}/#{name}-control"
