class NotificationMailer < ApplicationMailer

  before_action :hide_valediction

  def digest(user, frequency, digest_events)
    user_assignment user
    @frequency = frequency
    @projects, @annotations_and_comments =
      digest_events.values_at :projects, :annotations_and_comments
    mail(to: @user.email, subject: "Your #{frequency.to_s.capitalize} Manifold Summary")
  end

  def flag_notification(user, resource)
    user_assignment user
    @resource = resource.decorate
    @kind = resource.class.name.downcase
    subject = "#{indefinite_article_for @kind} #{@kind} has been flagged"
    mail(to: @user.email, subject: subject)
  end

  def comment_notification(user, comment)
    user_assignment user
    @comment = comment.decorate
    mail(to: @user.email, subject: "A comment has been made on #{@comment.title}")
  end

  def annotation_notification(user, annotation)
    user_assignment user
    @annotation = annotation.decorate
    mail(to: @user.email, subject: "An annotation has been made on #{@annotation.text_title}")
  end

  def reply_notification(user, comment)
    user_assignment user
    @comment = comment.decorate
    subject = "Someone replied to your comment on #{@comment.title}"
    mail(to: @user.email, subject: subject)
  end

  def reading_group_join_notification(user, reading_group_membership)
    user_assignment user
    @reading_group_membership = reading_group_membership.decorate
    subject = "Someone joined your reading group \"#{@reading_group_membership.reading_group_name}\""
    mail(to: @user.email, subject: subject)
  end

  private

  def user_assignment(user)
    @user = user
    @unsubscribe_token = UnsubscribeToken.generate user
  end

  # Roughly...
  def indefinite_article_for(name)
    return "A " unless %w(a e i o u).include? name.first

    "An "
  end
end
