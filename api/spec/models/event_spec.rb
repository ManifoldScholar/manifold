# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Event, type: :model do
  it "belongs to a subject" do
    expect(FactoryBot.create(:event).subject).not_to be_nil
  end

  it "is invalid without a project" do
    expect(FactoryBot.build(:event, project: nil)).not_to be_valid
  end

  it "is invalid without a subject" do
    expect(FactoryBot.build(:event, subject: nil)).not_to be_valid
  end

  it "has a valid factory" do
    expect(FactoryBot.create(:event)).to be_valid
  end

  context "can be searched", :elasticsearch do
    it "by title" do
      @event_a = FactoryBot.create(:event, subject_title: "Aquemini")
      @event_b = FactoryBot.create(:event, subject_title: "ATLiens")
      described_class.reindex
      described_class.searchkick_index.refresh
      results = described_class.filtered({ keyword: "Aquemini" })
      expect(results.length).to be 1
      results = described_class.filtered({ keyword: "ATLiens" })
      expect(results.length).to be 1
    end
  end

  context "can be filtered" do
    before do
      @event_a = FactoryBot.create(:event, subject_title: "Aquemini", event_type: EventType[:tweet])
      @event_b = FactoryBot.create(:event, subject_title: "Stankonia", event_type: EventType[:tweet])
      @event_c = FactoryBot.create(:event, subject_title: "ATLiens", event_type: EventType[:project_created])
    end

    it "by type" do
      results = described_class.filtered({ type: EventType[:tweet] })
      expect(results.length).to be 2
      results = described_class.filtered({ type: EventType[:project_created] })
      expect(results.length).to be 1
    end
  end

  it_behaves_like "a model with formatted attributes"
end
