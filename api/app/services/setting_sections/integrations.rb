# frozen_string_literal: true

module SettingSections
  # Information about various integrations for this Manifold installation.
  #
  # @see SettingSections::Secrets
  class Integrations < Base
    attribute :facebook_app_id, :string
    attribute :ga_four_tracking_id, :string
    attribute :google_client_email, :string
    attribute :google_client_id, :string
    attribute :google_private_key_id, :string
    attribute :google_project_id, :string
    attribute :twitter_access_token, :string
    attribute :twitter_app_id, :string

    # Used by OAuth provider, but not exposed in the API.
    attribute :google_oauth_client_id, :string
  end
end
