require "rails_helper"

RSpec.describe Notifications::SendDigestJob, type: :job do

  describe "#perform" do

    let(:user) { FactoryBot.create(:user) }
    let(:daily) { NotificationFrequency[:daily] }
    let(:always) { NotificationFrequency[:always] }
    let(:daily_notifications) { { digest: daily,  followed_projects: always, digest_comments_and_annotations: always } }
    let(:project) { FactoryBot.create(:project) }

    before(:each) do
      user.favorite_projects << project
      user.save
      user.update(notification_preferences_by_kind: daily_notifications)
      Timecop.freeze(Date.today - 1.day) do
        @a_annotation_event = FactoryBot.create(:event,
                                                event_type: EventType[:text_annotated],
                                                subject: FactoryBot.create(:annotation),
                                                project: project)
      end
    end


    it "sends a digest email to the user" do
      described_class.new.perform(user.id, "daily")
      mail = ActionMailer::Base.deliveries.last
      expect(mail.to).to eq [user.email]
    end

  end

end
