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

# Refresh in case the Dotenv load changed things
RailsConfig.reload

number_of_workers = PumaConfig.worker_count || ( RailsConfig.development? ? 0 : 2)
listen_on_socket = PumaConfig.application.listen_on_socket?
application = PumaConfig.puma_application


if listen_on_socket
  pidfile PumaConfig.application.pid_file
  state_path PumaConfig.application.state_file
end

tag "manifold-#{application}"
environment RailsConfig.env
workers number_of_workers
threads RailsConfig.min_threads, RailsConfig.max_threads
preload_app!
fork_worker 1000
wait_for_less_busy_worker 0.001

plugin :tmp_restart
bind "unix://#{PumaConfig.application.socket}" if listen_on_socket
bind "tcp://#{PumaConfig.application.address}:#{PumaConfig.application.port}" if PumaConfig.application.listen_on_port?

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
