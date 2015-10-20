#!/usr/bin/env puma

daemonize true
pidfile 'tmp/pids/puma.pid'
state_path 'tmp/pids/puma.state'
threads 0, 16
tag 'manifold-api'

socket_path = "unix://#{ENV['RAILS_SERVER_SOCKET_PATH']}"
socket_dir = "unix://#{ENV['RAILS_SERVER_SOCKET_DIR']}"
environment 'production'

bind socket_path
activate_control_app "#{socket_dir}/manifold-api-control"
