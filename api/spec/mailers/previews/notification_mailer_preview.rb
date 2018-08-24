class NotificationMailerPreview < ActionMailer::Preview
  # Accessible from http://manifold.lvh/rails/mailers/notification_mailer/digest.html
  def digest_daily
    NotificationMailer.digest(user, "daily", events)
  end

  def digest_weekly
    NotificationMailer.digest(user, "weekly", events)
  end

  # Accessible from http://manifold.lvh/rails/mailers/notification_mailer/flag_notification.html
  def flag_notification
    NotificationMailer.flag_notification(user, flagged_resource)
  end

  # Accessible from http://manifold.lvh/rails/mailers/notification_mailer/comment_notification.html
  def comment_notification
    NotificationMailer.comment_notification(user, comment)
  end

  # Accessible from http://manifold.lvh/rails/mailers/notification_mailer/reply_notification.html
  def reply_notification
    NotificationMailer.reply_notification(user, reply)
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

  def comment
    Comment.last
  end

  def reply
    Comment.where.not(parent: nil).first
  end

  def flagged_resource
    Comment.new(
      subject: Annotation.last,
      body: "Something very, very bad",
      flags_count: 3
    )
  end

  def events
    {
      projects: Event.by_subject_type(%w(Text Resource Collection)).group_by(&:project),
      annotations_and_comments: Event.by_subject_type(%w(Annotation Comment)).group_by { |e| e.is_a?(Annotation) ? e.project : e.subject.project }
    }
  end
end
