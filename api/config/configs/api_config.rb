# frozen_string_literal: true
require_relative "application_config"

class ApiConfig < ApplicationConfig
  attr_config :port, :socket
  attr_config(
    pid_file: "tmp/pids/manifold-api.pid",
    state_file: "tmp/pids/manifold-api.state",
    bind_ip: "0.0.0.0"
  )

  def listen_on_port?
    port.present?
  end

  def listen_on_socket?
    socket.present?
  end

  def address
    bind_ip
  end
end
