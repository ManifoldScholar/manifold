require "rails_helper"

RSpec.describe NotificationMailer, type: :mailer do
  let(:project_one) { FactoryBot.create(:project) }
  let(:project_two) { FactoryBot.create(:project) }
  let!(:events) do
    return [
      FactoryBot.create(:event, :project_created, project: project_one),
      FactoryBot.create(:event, :project_created, project: project_two)
    ]
  end
  let(:flagged_comment) { FactoryBot.create(:comment, flags_count: 3) }
  let(:reading_group_membership) { FactoryBot.create(:reading_group_membership) }
  let(:events) do
    {
      projects: Event
        .where(project: [project_one.id, project_two.id])
        .by_subject_type(%w(Text Resource Collection))
        .group_by(&:project),
      annotations_and_comments: Event.where(project: Project.pluck(:id)).by_subject_type(%w(Annotation Comment)).group_by(&:project)
    }
  end
  let(:user) { FactoryBot.create(:user) }

  describe "daily digest" do
    let(:mail) { NotificationMailer.digest(user, "daily", events) }

    it "renders without exception" do
      expect(mail.body.encoded).to include(user.first_name)
    end
  end

  describe "weekly digest" do
    let(:mail) { NotificationMailer.digest(user, "weekly", events) }

    it "renders without exception" do
      expect(mail.body.encoded).to include(user.first_name)
    end
  end

  describe "flag notification" do
    let(:mail) { NotificationMailer.flag_notification(user, flagged_comment) }

    it "renders without exception" do
      expect(mail.body.encoded).to include(user.first_name)
    end
  end

  describe "comment notification" do
    let(:mail) { NotificationMailer.comment_notification(user, flagged_comment) }

    it "renders without exception" do
      expect(mail.body.encoded).to include(user.first_name)
    end
  end

  describe "reply notification" do
    let(:mail) { NotificationMailer.reply_notification(user, flagged_comment) }

    it "renders without exception" do
      expect(mail.body.encoded).to include(user.first_name)
    end
  end

  describe "reading group join notification" do
    let(:mail) { NotificationMailer.reading_group_join_notification(user, reading_group_membership) }

    it "renders without exception" do
      expect(mail.body.encoded).to include(user.first_name)
    end
  end
end
