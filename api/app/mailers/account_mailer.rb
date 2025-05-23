# frozen_string_literal: true

class AccountMailer < ApplicationMailer
  def email_confirmation(user)
    @email_confirmation_url = @api_routes.email_confirmation_url_for(user)
    @user = user
    mail(to: @user.email, subject: "Confirm Your Email")
  end

  def reset_password(user)
    @user = user
    mail(to: @user.email, subject: "Password reset requested")
  end

  def password_change_notification(user)
    @user = user
    mail(to: @user.email, subject: "Your password has been reset")
  end

  def welcome(user, created_by_admin: false)
    @email_confirmation_url = @api_routes.email_confirmation_url_for(user)
    @user = user
    @created_by_admin = created_by_admin
    mail(to: @user.email, subject: "Welcome to Manifold!")
  end
end
