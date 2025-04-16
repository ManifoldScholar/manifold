# frozen_string_literal: true

class TestMailer < ApplicationMailer
  def test(user)
    @user = user
    message = mail(to: @user.email, subject: "All Manifold email systems are go!") # rubocop:todo Rails/I18nLocaleTexts
    message.raise_delivery_errors = true
    message
  end
end
