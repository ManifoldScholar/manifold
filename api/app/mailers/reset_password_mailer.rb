class ResetPasswordMailer < ActionMailer::Base
  default from: "no-reply@manifold.app"

  def reset_password(user)
    @user = user
    mail(to: @user.email, subject: "Password reset requested")
  end

  def admin_reset_email(user)
    @user = user
    mail(to: @user.email, subject: "Your password has been reset")
  end
end
