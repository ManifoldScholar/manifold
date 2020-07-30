#!/usr/bin/env puma
require "dotenv"
require "active_support/core_ext/object/blank"

rails_environment = ENV["RAILS_ENV"] || "development"
is_development = rails_environment == "development"

Dotenv.load(
  File.join(__dir__, "../../.env.local"),
  File.join(__dir__, "../../.env.#{rails_environment}"),
  File.join(__dir__, "../../.env")
)

listen_on_socket = ENV["API_SOCKET"].present?
listen_on_port = ENV["API_PORT"].present? || !listen_on_socket

number_of_workers = ENV.fetch "WORKER_COUNT" do
  rails_environment == "development" ? 0 : 2
end

min_threads = ENV.fetch "RAILS_MIN_THREADS" do
  0
end

max_threads = ENV.fetch "RAILS_MAX_THREADS" do
  is_development ? 16 : 6
end

port = ENV["API_PORT"] || 3020
socket = ENV["API_SOCKET"]
ip = ENV["API_BIND_IP"] || "0.0.0.0"

daemonize false
pidfile "tmp/pids/manifold-api.pid"
state_path "tmp/pids/manifold-api.state"
tag "manifold-api"
environment rails_environment

workers number_of_workers
threads min_threads, max_threads

preload_app!

bind "unix://#{socket}" if listen_on_socket
bind "tcp://#{ip}:#{port}" if listen_on_port
