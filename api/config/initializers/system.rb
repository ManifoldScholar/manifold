# frozen_string_literal: true

Dry::Rails.container do
  configure do |config|
    config.component_dirs.add "app/operations"
  end

  register :email_confirmation_verifier, memoize: true do
    Rails.application.message_verifier("email_confirmation")
  end

  if Rails.env.test?
    require "dry/system/stubs"

    enable_stubs!
  end
end
