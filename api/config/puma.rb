#!/usr/bin/env puma
require "dotenv"
require "active_support/core_ext/object/blank"

Dotenv.load

listen_on_socket = ENV["API_SOCKET"].present?
listen_on_port = ENV["API_PORT"].present? || !listen_on_socket
rails_environment = ENV["RAILS_ENV"] || "development"
port = ENV["API_PORT"] || 3020
socket = ENV["API_SOCKET"]
ip = ENV["API_BIND_IP"] || "0.0.0.0"

daemonize false
pidfile "tmp/pids/manifold-api.pid"
state_path "tmp/pids/manifold-api.state"
tag "manifold-api"
environment rails_environment

if rails_environment == "development"
  workers 1
  threads 0, 16
else
  workers 2
  threads 0, 6
end

preload_app!

bind "unix://#{socket}" if listen_on_socket
bind "tcp://#{ip}:#{port}" if listen_on_port
