require "rails_helper"

RSpec.describe Notifications::ComposeDigestEvents do
  let(:user) { FactoryBot.create(:user, role: :admin) }
  let(:project_a) { FactoryBot.create(:project) }
  let(:project_b) { FactoryBot.create(:project) }
  let(:project_c) { FactoryBot.create(:project) }

  before(:each) do
    user.favorite_projects << project_a
    user.favorite_projects << project_c
    Timecop.freeze(Date.today - 1.day) do
      @a_annotation_event = FactoryBot.create(:event,
                                              event_type: EventType[:text_annotated],
                                              subject: FactoryBot.create(:annotation),
                                              project: project_a)
      @b_annotation_event = FactoryBot.create(:event,
                                              event_type: EventType[:text_annotated],
                                              subject: FactoryBot.create(:annotation),
                                              project: project_b)
      @c_comment_event = FactoryBot.create(:event,
                                            event_type: EventType[:comment_created],
                                            subject: FactoryBot.create(:comment),
                                            project: project_c)
      @a_text_event = FactoryBot.create(:event,
                                        event_type: EventType[:text_added],
                                        subject: FactoryBot.create(:text),
                                        project: project_a)
      @b_resource_event = FactoryBot.create(:event,
                                            event_type: EventType[:resource_added],
                                            subject: FactoryBot.create(:resource),
                                            project: project_b)
      @c_collection_event = FactoryBot.create(:event,
                                            event_type: EventType[:collection_added],
                                            subject: FactoryBot.create(:collection),
                                            project: project_c)
    end
  end

  describe "the results" do
    context "when projects only" do
      before(:each) do  set_user_preferences(user, { digest: NotificationFrequency[:weekly],
                                                     projects: NotificationFrequency[:always] })
      end

      it "contains the correct events" do
        events = described_class.run(user: user,
                                     frequency: NotificationFrequency["weekly"]).result
        expect(events["projects"].values).to match_array [[@a_text_event], [@b_resource_event], [@c_collection_event]]
      end
    end

    context "when followed projects only" do
      before(:each) do  set_user_preferences(user, { digest: NotificationFrequency[:weekly],
                                                     followed_projects: NotificationFrequency[:always] })
      end

      it "contains the correct events" do
        events = described_class.run(user: user, frequency: NotificationFrequency[:weekly]).result
        expect(events["projects"].values).to match_array [[@a_text_event], [@c_collection_event]]
      end
    end

    context "when annotations and comments included" do
      describe "contains events correctly scoped" do
        it "to the user's favorite projects" do
          set_user_preferences(user, { digest: NotificationFrequency[:weekly],
                                       digest_comments_and_annotations: NotificationFrequency[:always] })
          events = described_class.run(user: user, frequency: NotificationFrequency[:weekly]).result
          expect(events["annotations_and_comments"].values).to match_array [[@a_annotation_event], [@c_comment_event]]
        end

        it "to the user's visible projects" do
          set_user_preferences(user, { digest: NotificationFrequency[:weekly],
                                       projects: NotificationFrequency[:always],
                                       digest_comments_and_annotations: NotificationFrequency[:always] })
          events = described_class.run(user: user, frequency: NotificationFrequency[:weekly]).result
          expect(events["annotations_and_comments"].values).to match_array [[@a_annotation_event], [@b_annotation_event], [@c_comment_event]]
        end
      end
    end
  end
end

def set_user_preferences(user, prefrences)
  user.update(notification_preferences_by_kind: prefrences)
end
