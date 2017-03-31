#!/usr/bin/env puma
daemonize false
pidfile "tmp/pids/cable.pid"
state_path "tmp/pids/cable.state"
workers 2
threads 0, 6
tag "manifold-cable"
preload_app!
rackup      "cable/config.ru"
environment ENV["RAILS_ENV"] || "development"
bind "tcp://0.0.0.0:#{ENV["CABLE_PORT"]}"
