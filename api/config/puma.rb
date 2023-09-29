#!/usr/bin/env puma
# frozen_string_literal: true

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

env_var_lookups = {
  "API" => "API",
  "CABLE" => "API_CABLE"
}

application = ENV.fetch("PUMA_APPLICATION", "api").upcase
env_var_lookup = env_var_lookups[application]
port = ENV.fetch("#{env_var_lookup}_PORT", nil)
socket = ENV.fetch("#{env_var_lookup}_SOCKET", nil)
pidfile_path = ENV.fetch("#{env_var_lookup}_PIDFILE", "tmp/pids/manifold-#{application.downcase}.pid")
state_path = ENV.fetch("#{env_var_lookup}_STATEFILE", "tmp/pids/manifold-#{application.downcase}.state")
listen_on_port = port.present?
listen_on_socket = socket.present?
address = ENV.fetch("#{env_var_lookup}_BIND_IP", "0.0.0.0")

number_of_workers = ENV.fetch "WORKER_COUNT" do
  rails_environment == "development" ? 0 : 2
end

min_threads = ENV.fetch("RAILS_MIN_THREADS", 0)

max_threads = ENV.fetch "RAILS_MAX_THREADS" do
  is_development ? 16 : 6
end

pidfile pidfile_path
state_path state_path
tag "manifold-#{application}"
environment rails_environment
workers number_of_workers
threads min_threads, max_threads
preload_app!
fork_worker 1000
wait_for_less_busy_worker 0.001

plugin :tmp_restart
bind "unix://#{socket}" if listen_on_socket
bind "tcp://#{address}:#{port}" if listen_on_port

on_refork do
  3.times { GC.start }
end

on_worker_fork do
  ActiveSupport.on_load(:active_record) do
    ActiveRecord::Base.connection.disconnect!
  end

  # Ensure we disconnect from Rails cache on forking.
  Rails.cache.redis.disconnect!

  Redis.current.disconnect!

  Redis::Objects.redis.disconnect!
end

on_worker_boot do
  # Worker specific setup for Rails 4.1+
  ActiveSupport.on_load(:active_record) do
    ActiveRecord::Base.establish_connection
  end
end

out_of_band do
  GC.start full_mark: false, immediate_sweep: false
end
