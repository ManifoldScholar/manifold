require 'rails_helper'

RSpec.describe Analytics::Reports::ForText do

  let(:text) { texts.first }
  let(:scope) { text }

  include_examples "analytics reporter visits"

  include_examples "analytics reporter events" do
    include_context "with a single text"

    let(:share_actions) { %w[facebook twitter] }

    let(:share_clicks) do
      visits.each do |visit|
        text.text_sections.each do |text_section|
          share_actions.map do |action|
            FactoryBot.create :analytics_event,
                              record: text_section,
                              name: "share button click",
                              properties: { share_action: action },
                              time: visit.started_at + 10.minutes
          end
        end
      end
    end

    let(:events) do
      annotations
      text_view_events
      text_section_view_events
      share_clicks
    end

    let(:expectations) do
      ->(results) {
        results.find { |r| r["name"] == "daily_visitors" }.tap do |h|
          expect(h["data"].all? { |d| d["y"] == text_view_event_count })
        end

        results.find { |r| r["name"] == "annotations" }.tap do |h|
          expect(h["data"].all? { |d| d["count"] == repeat_users.count })
        end

        results.find { |r| r["name"] == "text_section_views" }.tap do |h|
          expect(h.dig("data").count).to be text.text_sections.count
          expect(h["data"].all? { |d| d["count"] == text_section_view_event_count })
        end

        results.find { |r| r["name"] = "share_clicks" }.tap do |h|
          expect(h["data"].all? { |d| d["share_action"].in?(share_actions) })
          expect(h["data"].all? { |d| d["count"] == share_actions.count })
        end
      }
    end

  end

end
