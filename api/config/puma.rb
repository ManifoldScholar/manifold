#!/usr/bin/env puma
require "dotenv"
require "active_support/core_ext/object/blank"

# Setup environment
rails_environment = ENV["RAILS_ENV"] || "development"
is_development = rails_environment == "development"

Dotenv.load(
  File.join(__dir__, "../../.env.local"),
  File.join(__dir__, "../../.env.#{rails_environment}"),
  File.join(__dir__, "../../.env")
)

is_cable_puma = ENV.fetch("IS_CABLE") { false }
is_api_puma = !is_cable_puma
api_port = ENV["API_PORT"] || 3020
api_cable_port = ENV["API_CABLE_PORT"] || 3021
port = is_api_puma ? api_port : api_cable_port
listen_on_port = is_api_puma ? ENV["API_PORT"].present? : ENV["API_CABLE_PORT"].present?
socket = is_api_puma ? ENV["API_SOCKET"] : ENV["API_CABLE_SOCKET"]
listen_on_socket = is_api_puma ? ENV["API_SOCKET"].present? : ENV["API_CABLE_SOCKET"].present?
ip = (is_api_puma ? ENV["API_BIND_IP"] : ENV["API_CABLE_BIND_IP"]) || "0.0.0.0"
label = is_api_puma ? "api" : "cable"

number_of_workers = ENV.fetch "WORKER_COUNT" do
  rails_environment == "development" ? 0 : 2
end

min_threads = ENV.fetch "RAILS_MIN_THREADS" do
  0
end

max_threads = ENV.fetch "RAILS_MAX_THREADS" do
  is_development ? 16 : 6
end

pidfile "tmp/pids/manifold-#{label}.pid"
state_path "tmp/pids/manifold-#{label}.state"
tag "manifold-#{label}"
environment rails_environment
workers number_of_workers
threads min_threads, max_threads
nakayoshi_fork
fork_worker 1000
wait_for_less_busy_worker
on_refork do
  3.times { GC.start }
end

bind "unix://#{socket}" if listen_on_socket
bind "tcp://#{ip}:#{port}" if listen_on_port

out_of_band do
  GC.start full_mark: false, immediate_sweep: false
end
