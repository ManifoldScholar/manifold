# frozen_string_literal: true

class S3Config < ApplicationConfig
  attr_config :access_key_id, :secret_access_key, :endpoint, :region, force_path_style: false

  def build_s3_client
    Aws::S3::Client.new(
      access_key_id:,
      secret_access_key:,
      endpoint:,
      force_path_style:,
      region:
    )
  end
end
