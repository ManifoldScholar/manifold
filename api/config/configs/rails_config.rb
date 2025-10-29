# frozen_string_literal: true
require_relative "application_config"

class RailsConfig < ApplicationConfig
  attr_config(
    :env,
    :max_threads,
    :serve_static_files,
    :log_to_stdout,
    :secret_key,
    :db_pass,
    :db_user,
  )

  attr_config(
    db_host: 'localhost',
    db_port: 5432,
    db_name: 'manifold_development',
    test_db_name: 'manifold_test',
    min_threads: 0,
    redis_namespace: 'manifold',
    redis_url: 'redis://127.0.0.1:6379'
  )

  def development?
    env == "development"
  end

  def secret_key_base
    secret_key
  end

  def max_threads_general
    max_threads || 50
  end

  def max_threads_for_puma
    max_threads || (development? ? 16 : 6)
  end
end

