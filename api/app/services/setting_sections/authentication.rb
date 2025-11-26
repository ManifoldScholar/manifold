# frozen_string_literal: true

module SettingSections
  # The authentication section for login and identity provider options.
  #
  # @see Settings
  class Authentication < Base

    attribute :identity_providers, :string
    attribute :default_identity_provider, :string
    attribute :show_local_login, :boolean, default: true

  end
end
