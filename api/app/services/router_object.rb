# frozen_string_literal: true

class RouterObject
  extend Dry::Initializer

  include Rails.application.routes.url_helpers
  include Sliceable

  option :host, Types::String, default: proc { ManifoldConfig.domain.presence || "example.com" }
  option :protocol, Types::String, default: proc { ManifoldConfig.protocol.presence || "http" }

  def default_url_options
    slice(:host, :protocol)
  end
end
