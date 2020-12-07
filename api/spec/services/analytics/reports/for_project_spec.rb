require "rails_helper"

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
      l_daily_visitors = (visit_days - 1).times.map do |t|
        { "x" => (Date.yesterday - (t + 1).days).to_s, "y" => repeat_visitor_count }
      end.tap { |a| a.push({ "x" => Date.yesterday.to_s, "y" => visitor_count }) }

      l_unique_visitors = {
        "value" => visitor_count
      }

      l_annotations = [{
        "highlights" => per_group_annotations_count * 4,
        "private_annotations" => per_group_annotations_count,
        "public_annotations" => per_group_annotations_count,
        "reading_group_annotations" => per_group_annotations_count * 2
      }]

      l_favorites_this_period = {
        "value" => project_favorites_count
      }

      l_total_favorites = {
        "value" => project.favorites.count
      }

      {
        daily_visitors: l_daily_visitors,
        unique_visitors: l_unique_visitors,
        annotations: l_annotations,
        favorites_this_period: l_favorites_this_period,
        total_favorites: l_total_favorites
      }
    end
  end
end
