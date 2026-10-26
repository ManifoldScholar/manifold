# frozen_string_literal: true

module LtiSettingsHelper
  # Enables LTI and autoregistration so registration flows run past their configuration guards.
  def enable_lti_autoregistration!
    Settings.instance.update!(lti: { enabled: true, autoregistration: true })
  end
end

RSpec.configure do |config|
  config.include LtiSettingsHelper
end
