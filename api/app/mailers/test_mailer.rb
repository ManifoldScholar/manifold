class TestMailer < ApplicationMailer
  def test(user)
    @user = user
    message = mail(to: @user.email, subject: "All Manifold email systems are go!")
    message.raise_delivery_errors = true
    message
  end
end
