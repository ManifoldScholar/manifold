class RouterObject
  extend Dry::Initializer

  include Rails.application.routes.url_helpers
  include Sliceable

  option :host, Types::String, default: proc { Rails.application.config.manifold.domain }
  option :protocol, Types::String, default: proc { Rails.application.config.manifold.protocol }

  def default_url_options
    slice(:host, :protocol)
  end
end
