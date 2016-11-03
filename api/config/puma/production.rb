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
socket_path = "unix://#{ENV['RAILS_SERVER_SOCKET_PATH']}"
bind socket_path

on_worker_boot do
  ActiveRecord::Base.establish_connection
end
