#!/usr/bin/env puma
daemonize false
pidfile "tmp/pids/puma.pid"
state_path "tmp/pids/puma.state"
workers 2
threads 0, 6
tag "manifold-api"
preload_app!
rackup      DefaultRackup
environment ENV["RAILS_ENV"] || "development"
name = "manifold-api"
socket_dir = "unix://#{ENV['RAILS_SERVER_SOCKET_DIR']}"
socket_path = "unix://#{ENV['RAILS_SERVER_SOCKET_PATH']}"
bind socket_path

activate_control_app "#{socket_dir}/#{name}-control"
on_worker_boot do
  ActiveRecord::Base.establish_connection
end
