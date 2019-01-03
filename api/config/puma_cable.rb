#!/usr/bin/env puma
require "dotenv"
Dotenv.load

daemonize false
pidfile "tmp/pids/manifold-cable.pid"
state_path "tmp/pids/manifold-cable.state"
threads 0, 16
tag "manifold-cable"
environment ENV["RAILS_ENV"] || "development"
port = ENV["CABLE_PORT"]

if ENV["CABLE_SERVER_SOCKET_DIR"] && ENV["CABLE_SERVER_SOCKET_PATH"]
  socket_dir = "unix://#{ENV['CABLE_SERVER_SOCKET_DIR']}"
  socket_path = "unix://#{ENV['CABLE_SERVER_SOCKET_PATH']}"
end

bind socket_path if socket_dir && socket_path
bind "tcp://#{ENV['CABLE_BIND_IP']}:#{port}" if port
