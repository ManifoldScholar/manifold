class WelcomeMailer < ActionMailer::Base
  default from: "no-reply@manifold.app"

  def welcome(user)
    @user = user
    mail(to: @user.email, subject: "Welcome to Manifold!")
  end
end
