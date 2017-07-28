class AccountMailer < ApplicationMailer
  def reset_password(user)
    @user = user
    mail(to: @user.email, subject: "Password reset requested")
  end

  def password_change_notification(user)
    @user = user
    mail(to: @user.email, subject: "Your password has been reset")
  end

  def welcome(user, created_by_admin = false)
    @user = user
    @created_by_admin = created_by_admin
    mail(to: @user.email, subject: "Welcome to Manifold!")
  end
end
