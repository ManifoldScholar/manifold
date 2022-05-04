# frozen_string_literal: true

require "rails_helper"

RSpec.describe ReadingGroups::Operations::Clone do
  let!(:source_group) { FactoryBot.create :reading_group }
  let!(:user) { FactoryBot.create :user }

  let(:operation) do
    described_class.new source_group, user: user
  end

  context "when things are collected" do
    let!(:category) { FactoryBot.create :reading_group_category, reading_group: source_group }

    let!(:collected_project_entry) { FactoryBot.create :reading_group_project, reading_group: source_group, reading_group_category: category }
    let!(:collected_project_text) { FactoryBot.create :reading_group_text, reading_group: source_group, reading_group_category: category }
    let!(:uncategorized_collected_resource) { FactoryBot.create :reading_group_text, reading_group: source_group, reading_group_category: nil }

    it "clones the collected entries" do
      expect do
        @result = operation.call

        expect(@result).to be_success
      end.to change(ReadingGroupCategory, :count).by(1).and(change(ReadingGroupText, :count).by(2)).and(change(ReadingGroupProject, :count).by(1))
    end
  end
end
