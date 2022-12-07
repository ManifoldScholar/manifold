# frozen_string_literal: true

RSpec.describe Analytics::Reports::ForProject do
  include_context "with a single project"

  include_examples "analytics reporter visits"

  let(:scope) { project }

  include_examples "analytics reporter events" do
    let(:expectations) do
      l_daily_visitors = build_expected_daily_visitors from_date: Date.yesterday

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
