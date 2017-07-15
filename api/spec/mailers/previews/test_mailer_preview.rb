class TestMailerPreview < ActionMailer::Preview
  # Accessible from http://manifold.dev/rails/mailers/test_mailer/test.html
  def test
    TestMailer.test(User.first)
  end
end
