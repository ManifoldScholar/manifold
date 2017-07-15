class WelcomeMailer < ActionMailer::Base
  def welcome(user)
    @user = user
    mail(to: @user.email, subject: "Welcome to Manifold!")
  end
end
