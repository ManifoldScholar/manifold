#!/usr/bin/env puma
require "dotenv"
require "active_support/core_ext/object/blank"

Dotenv.load

listen_on_socket = ENV["API_CABLE_SOCKET"].present?
listen_on_port = ENV["API_CABLE_PORT"].present? || !listen_on_socket

port = ENV["API_CABLE_PORT"] || 3021
socket = ENV["API_CABLE_SOCKET"]
ip = ENV["API_CABLE_BIND_IP"] || "0.0.0.0"

daemonize false
pidfile "tmp/pids/manifold-cable.pid"
state_path "tmp/pids/manifold-cable.state"
threads 0, 16
tag "manifold-cable"
environment ENV["RAILS_ENV"] || "development"

bind "unix://#{socket}" if listen_on_socket
bind "tcp://#{ip}:#{port}" if listen_on_port
