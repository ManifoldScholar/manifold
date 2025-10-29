#!/usr/bin/env puma
# frozen_string_literal: true

require "dotenv"
require "active_support/core_ext/object/blank"
require_relative "configs/rails_config.rb"
require_relative "configs/puma_config.rb"

# Setup environment
Dotenv.load(
  File.join(__dir__, "../../.env.local"),
  File.join(__dir__, "../../.env.#{RailsConfig.env}"),
  File.join(__dir__, "../../.env")
)

rails_config = RailsConfig.new
puma_config = PumaConfig.new

number_of_workers = puma_config.worker_count || ( rails_config.development? ? 0 : 2)
listen_on_socket = puma_config.application.listen_on_socket?
application = puma_config.puma_application


if listen_on_socket
  pidfile puma_config.application.pid_file
  state_path puma_config.application.state_file
end

tag "manifold-#{application}"
environment rails_config.env
workers number_of_workers
threads rails_config.min_threads, rails_config.max_threads
preload_app!
fork_worker 1000
wait_for_less_busy_worker 0.001

plugin :tmp_restart
bind "unix://#{puma_config.application.socket}" if listen_on_socket
bind "tcp://#{puma_config.application.address}:#{puma_config.application.port}" if puma_config.application.listen_on_port?

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
