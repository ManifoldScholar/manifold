require 'rails_helper'

RSpec.describe Analytics::Reports::Global do

  include_examples "analytics reporter visits"

  include_examples "analytics reporter events" do
    include_context "with projects"
    
    let(:search_events) do
      visits.map do |v|
        FactoryBot.create(:analytics_event, visit: v, name: "search", properties: { keyword: Faker::Lorem.word })
      end
    end

    let(:events) do
      annotations
      project_view_events
      search_events
    end

    let(:expectations) do
      ->(results) {
        results.find { |r| r["name"] == "daily_visitors" }.tap do |h|
          expect(h["data"].all? { |d| d["y"] == repeat_users.count })
        end

        results.find { |r| r["name"] == "returning_visitors" }.tap do |h|
          expect(h.dig("data", "value")).to be_a Float
        end
      }
    end

  end

end
