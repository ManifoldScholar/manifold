class NotificationMailer < ApplicationMailer
  before_action :hide_valediction

  def digest(user, frequency, digest_events)
    @user = user
    @frequency = frequency
    @token = UnsubscribeToken.generate user
    @projects, @annotations_and_comments =
      digest_events.values_at :projects, :annotations_and_comments

    mail(to: @user.email, subject: "Your #{frequency.to_s.capitalize} Manifold Summary")
  end

  def flag_notification(user, resource)
    @user = user
    @resource = resource
    @kind = resource.class.name.downcase
    @token = UnsubscribeToken.generate user
    subject = "#{indefinite_article_for @kind} #{@kind} has been flagged"

    mail(to: @user.email, subject: subject)
  end

  def comment_notification(user, comment)
    @user = user
    @comment = comment.decorate
    @token = UnsubscribeToken.generate user

    mail(to: @user.email, subject: "A comment has been made on #{@comment.title}")
  end

  def reply_notification(user, comment)
    @user = user
    @comment = comment.decorate
    @token = UnsubscribeToken.generate user
    subject = "Someone replied to your comment on #{@comment.title}"

    mail(to: @user.email, subject: subject)
  end

  private

  # Roughly...
  def indefinite_article_for(name)
    return "A " unless %w(a e i o u).include? name.first
    "An "
  end
end
