# frozen_string_literal: true

# Development-only initialization
# These settings may be dangerous in production.

if Rails.env.development?
  Rails.application.configure do
    config.after_initialize do
      # Rails.application.eager_load! # Uncomment to eager load in dev

      require Rails.root.join("app/models/content_block.rb")

      Rails.root.glob("app/models/**/*.rb").each do |content_block_model|
        require_relative content_block_model
      end
    rescue ActiveRecord::ActiveRecordError
      # purposely left blank
    end
  end

  # Disable SSL verification for OpenIDConnect gem, allowing self-signed certificates for dev IDPs
  OpenIDConnect.http_config do |client|
    client.ssl_config.verify_mode=OpenSSL::SSL::VERIFY_NONE
  end
end
