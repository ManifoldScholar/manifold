require "rails_helper"

RSpec.describe Notifications::ComposeDigestEvents, interaction: true do
  let_input!(:user) { FactoryBot.create(:user, :admin) }
  let_input!(:frequency) { "weekly" }

  let!(:project_a) { FactoryBot.create(:project, title: "Project A") }
  let!(:project_b) { FactoryBot.create(:project, title: "Project B") }
  let!(:project_c) { FactoryBot.create(:project, title: "Project C") }

  let!(:a_annotation_event) { past_event :text_annotated, on: project_a }
  let!(:b_annotation_event) { past_event :text_annotated, on: project_b }
  let!(:c_comment_event) { past_event :comment_created, on: project_c }
  let!(:a_text_event) { past_event :text_added, on: project_a }
  let!(:b_resource_event) { past_event :resource_added, on: project_b }
  let!(:c_collection_event) { past_event :resource_collection_added, on: project_c }

  before(:each) do
    user.collect_model! project_a
    user.collect_model! project_c
  end

  def past_event(*traits, on:, at: Date.current.yesterday, **other_attrs)
    Timecop.freeze at do
      attrs = { **other_attrs, project: on }

      FactoryBot.create :event, *traits, **attrs
    end
  end

  def set_user_preferences!(target_user: user, **preferences)
    preferences.transform_values! { |frequency| NotificationFrequency.fetch frequency }

    target_user.update!(notification_preferences_by_kind: preferences)
  end

  describe "the results" do
    context "when projects only" do
      before(:each) do
        set_user_preferences! digest: :weekly, projects: :always
      end

      it "contains the correct events" do
        perform_within_expectation!

        events = @outcome.result

        expect(events["projects"].values).to match_array [[a_text_event], [b_resource_event], [c_collection_event]]
      end
    end

    context "when followed projects only" do
      before(:each) do
        set_user_preferences! digest: :weekly, followed_projects: :always
      end

      it "contains the correct events" do
        perform_within_expectation!

        events = @outcome.result

        expect(events["projects"].values).to match_array [[a_text_event], [c_collection_event]]
      end
    end

    context "when annotations and comments included" do
      describe "contains events correctly scoped" do
        it "to the user's favorite projects" do
          set_user_preferences! digest: :weekly, digest_comments_and_annotations: :always

          perform_within_expectation!

          events = @outcome.result

          expect(events["annotations_and_comments"].values).to match_array [[a_annotation_event], [c_comment_event]]
        end

        it "to the user's visible projects" do
          set_user_preferences! digest: :weekly, projects: :always, digest_comments_and_annotations: :always

          perform_within_expectation!

          events = @outcome.result

          expect(events["annotations_and_comments"].values).to match_array [[a_annotation_event], [b_annotation_event], [c_comment_event]]
        end
      end
    end
  end
end
