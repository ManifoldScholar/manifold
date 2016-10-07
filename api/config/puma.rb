#!/usr/bin/env puma
require 'dotenv'
Dotenv.load

daemonize false
pidfile "tmp/pids/puma.pid"
state_path "tmp/pids/puma.state"
threads 0, 16
tag "manifold-api"
environment ENV["RAILS_ENV"] || "development"
name = "manifold-api"

port = ENV['RAILS_SERVER_PORT'] || ENV['API_PORT']

if ENV["BOXEN_SOCKET_DIR"]
  socket_dir = "unix://#{ENV['BOXEN_SOCKET_DIR']}"
  socket_path = "#{socket_dir}/#{name}"
elsif ENV["APP_SOCKET_DIR"]
  socket_dir  = "unix://#{ENV['APP_SOCKET_DIR']}"
  socket_path = "#{socket_dir}/#{name}"
elseif ENV['RAILS_SERVER_SOCKET_DIR'] && ENV['RAILS_SERVER_SOCKET_PATH']
  socket_dir = "unix://#{ENV['RAILS_SERVER_SOCKET_DIR']}"
  socket_path = "unix://#{ENV['RAILS_SERVER_SOCKET_PATH']}"
end

bind socket_path if socket_dir && socket_path
activate_control_app "#{socket_dir}/#{name}-control" if socket_dir
bind "tcp://127.0.0.1:#{port}" if port
