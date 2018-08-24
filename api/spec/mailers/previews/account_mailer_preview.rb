require "securerandom"

class AccountMailerPreview < ActionMailer::Preview
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
    AccountMailer.welcome(user, true)
  end

  # Accessible from http://manifold.lvh/rails/mailers/account_mailer/password_change_notification.html
  def password_change_notification
    AccountMailer.password_change_notification(user)

  end

  private

  def user
    User.new({
      first_name: "Bilbo",
      last_name: "Baggins",
      nickname: "Short Stuff",
      email: "bilbo@bagend.com",
      password: SecureRandom.hex[0, 10 ]
             })
  end
end
