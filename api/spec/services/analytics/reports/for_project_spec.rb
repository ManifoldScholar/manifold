require 'rails_helper'

RSpec.describe Analytics::Reports::ForProject do

  let(:scope) { project }

  include_examples "analytics reporter visits"

  include_examples "analytics reporter events" do
    include_context "with a single project"

    let(:events) do
      annotations
      project_view_events
      favorites
      previous_favorites
    end

    let(:expectations) do
      ->(results) {
        results.find { |r| r["name"] == "daily_visitors" }.tap do |h|
          expect(h["data"].all? { |d| d["y"] == views_per_day_count })
        end

        results.find { |r| r["name"] == "annotations" }.tap do |h|
          expect(h["data"].all? { |d| d["count"] == annotations_count })
        end

        results.find { |r| r["name"] == "favorites_this_period" }.tap do |h|
          expect(h.dig("data", "value")).to be favorites_this_period_count
        end

        results.find { |r| r["name"] == "total_favorites" }.tap do |h|
          expect(h.dig("data", "value")).to be (favorites_this_period_count + previous_favorite_count)
        end
      }
    end

  end

end
