# frozen_string_literal: true

RSpec.describe Event, type: :model do
  context "when filtering" do
    let_it_be(:event_a, refind: true) { FactoryBot.create(:event, subject_title: "Aquemini", event_type: EventType[:tweet]) }
    let_it_be(:event_b, refind: true) { FactoryBot.create(:event, subject_title: "Stankonia", event_type: EventType[:tweet]) }
    let_it_be(:event_c, refind: true) { FactoryBot.create(:event, subject_title: "ATLiens", event_type: EventType[:project_created]) }

    it "can be found by keyword search on the title", :aggregate_failures do
      expect(described_class.filtered(keyword: "Aquemini")).to include event_a
      expect(described_class.filtered(keyword: "ATLiens")).to include event_c
    end

    it "can be filtered by type", :aggregate_failures do
      expect(described_class.filtered(type: EventType[:tweet])).to include event_a, event_b
      expect(Event.filtered(type: EventType[:project_created])).to include event_c
    end
  end

  it_behaves_like "a model with formatted attributes"
end
