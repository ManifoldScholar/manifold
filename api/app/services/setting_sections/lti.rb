# frozen_string_literal: true

module SettingSections
  # Settings that control LTI 1.3 integration behavior.
  #
  # @see Settings
  class Lti < Base
    attribute :enabled, :boolean, default: false
    attribute :autoregistration, :boolean, default: false
    attribute :issuer_allowlist, :string_array, default: -> { [] }
  end
end
