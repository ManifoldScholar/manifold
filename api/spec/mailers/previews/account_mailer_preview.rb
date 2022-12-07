# frozen_string_literal: true

class AccountMailerPreview < ActionMailer::Preview
  def email_confirmation
    AccountMailer.email_confirmation(user)
  end

  # Accessible from http://manifold.lvh/rails/mailers/account_mailer/reset_password.html
  def reset_password
    AccountMailer.reset_password(user)
  end

  # Accessible from http://manifold.lvh/rails/mailers/account_mailer/welcome.html
  def welcome
    AccountMailer.welcome(user)
  end

  # Accessible from http://manifold.lvh/rails/mailers/account_mailer/welcome_when_created_by_admin.html
  def welcome_when_created_by_admin
    AccountMailer.welcome(user, created_by_admin: true)
  end

  # Accessible from http://manifold.lvh/rails/mailers/account_mailer/password_change_notification.html
  def password_change_notification
    AccountMailer.password_change_notification(user)
  end

  private

  def user
    User.testing_user do |_, u|
      u.password = SecureRandom.hex[0, 10]

      u.prepare_email_confirmation!
    end
  end
end
