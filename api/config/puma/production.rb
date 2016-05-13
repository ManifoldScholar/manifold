#!/usr/bin/env puma
daemonize false
pidfile "tmp/pids/puma.pid"
state_path "tmp/pids/puma.state"
threads 0, 16
tag "manifold-api"
environment ENV["RAILS_ENV"]
name = "manifold-api"
socket_dir = "unix://#{ENV['RAILS_SERVER_SOCKET_DIR']}"
socket_path = "unix://#{ENV['RAILS_SERVER_SOCKET_PATH']}"
bind socket_path
activate_control_app "#{socket_dir}/#{name}-control"
