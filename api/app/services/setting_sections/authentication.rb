# frozen_string_literal: true

module SettingSections
  # The authentication section for login and identity provider options.
  #
  # @see Settings
  class Authentication < Base
    attribute :identity_providers, :string
    attribute :default_identity_provider, :string
    attribute :hide_local_login, :boolean, default: false
    attribute :disallow_email_change, :boolean, default: false
  end
end
