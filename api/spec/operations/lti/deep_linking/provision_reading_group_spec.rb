# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::DeepLinking::ProvisionReadingGroup do
  let(:user) { FactoryBot.create(:user, first_name: "Jane", last_name: "Doe") }
  let(:course_context) { FactoryBot.create(:lti_course_context, context_title: "Intro to Ruby", context_label: "CS101") }
  let(:project) { FactoryBot.create(:project) }
  let(:references) { [Lti::ResourceReference.new(type: "Project", id: project.id)] }

  subject(:provision) { described_class.new(course_context: course_context, user: user, references: references).call }

  it "creates a private group named from the course title, with the instructor as moderator" do
    expect(provision).to have_attributes(name: "Intro to Ruby", privacy: "private", creator: user)
    expect(provision.moderators).to include(user)
  end

  it "attaches the selected resource to the group" do
    expect(ReadingGroupProject.exists?(reading_group: provision, project: project)).to be(true)
  end

  it "reuses the existing group on a repeat call rather than duplicating it" do
    provision
    expect do
      described_class.new(course_context: course_context.reload, user: user, references: references).call
    end.not_to change(ReadingGroup, :count)
  end

  describe "name fallback" do
    it "uses the context label when the title is blank" do
      course_context.update!(context_title: nil)
      expect(provision.name).to eq("CS101")
    end

    it "uses the instructor's name when title and label are blank" do
      course_context.update!(context_title: nil, context_label: nil)
      expect(provision.name).to eq("Jane Doe's Course")
    end
  end
end
