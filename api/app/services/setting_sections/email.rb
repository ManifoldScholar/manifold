# frozen_string_literal: true

module SettingSections
  # Settings related to the email subsystem.
  #
  # @see DynamicMailer
  # @see SettingSections::Secrets#smtp_settings_password
  class Email < Base
    DELIVERY_METHODS = %w[smtp].freeze

    attribute :from_address, :string, default: "do-not-reply@manifoldapp.org"
    attribute :from_name, :string, default: "Manifold Scholarship"
    attribute :closing, :string, default: "Sincerely,\nThe Manifold Team"
    attribute :delivery_method, :string, default: "smtp"
    attribute :reply_to_address, :string, default: "do-not-reply@manifoldapp.org"
    attribute :reply_to_name, :string, default: "Manifold Scholarship"

    attribute :smtp_settings_address, :string
    attribute :smtp_settings_port, :integer
    attribute :smtp_settings_user_name, :string

    validates :delivery_method, inclusion: { in: DELIVERY_METHODS }
  end
end
