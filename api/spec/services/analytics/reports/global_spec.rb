require 'rails_helper'

RSpec.describe Analytics::Reports::Global do

  include_examples "analytics reporter visits"

  include_examples "analytics reporter events" do
    include_context "with projects"

    let(:werd) { Faker::Lorem.word }
    let(:search_events) do
      visits.map do |v|
        FactoryBot.create(:analytics_event, visit: v, name: "search", properties: { keyword: werd })
      end
    end

    let(:annotation_creation_events) do
      annotations.map do |a|
        Analytics::Event.create(name: "create_annotation", visit: Analytics::Visit.find_by(visitor_token: tokens[a.creator]), time: created_at[:created_at])
      end
    end

    let(:events) do
      search_events
      annotation_creation_events
    end

    let(:expectations) do
      l_daily_visitors = (visit_days - 1).times.map do |t|
        {"x" => (Date.yesterday - (t + 1).days).to_s, "y" => repeat_visitor_count }
      end.tap { |a| a.push({ "x" => Date.yesterday.to_s, "y" => visitor_count }) }

      l_unique_visitors = { "value" => visitor_count }

      l_repeat_visitors = {
        "numerator" => repeat_visitor_count,
        "denominator" => (visitor_count)
      }

      l_average_visit_duration = { "value" => visit_duration.seconds.to_i }

      l_top_projects = projects.map do |p|
        { "project_id" => p.id, "project_title" => p.title, "view_count" => (visits.count * views_per_day_count) }
      end

      l_active_visitors = {
        "numerator" => active_visitors.count,
        "denominator" => visitor_count
      }

      l_favorited_projects = {
        "value" => project_favorites_count
      }

      l_top_searches = [
        { "keyword" => werd, "count" => visits.count }
      ]

      {
        daily_visitors: l_daily_visitors,
        unique_visitors: l_unique_visitors,
        returning_visitors: l_repeat_visitors,
        average_visit_duration: l_average_visit_duration,
        top_projects: l_top_projects,
        active_visitors: l_active_visitors,
        favorited_projects: l_favorited_projects,
        top_search_terms: l_top_searches
      }
    end

    context "with different values for search counts" do
      let(:search_events) do
        [3, 1, 2].each do |count|
          word = Faker::Lorem.word

          count.times do
            FactoryBot.create(:analytics_event, visit: visits.first, name: "search", properties: { keyword: word })
          end
        end
      end

      it "should sort search results by count" do
        outcome = run_the_interaction!
        search_results = outcome.result.find { |r| r["name"] == "top_search_terms" }["data"]
        sorted = search_results.sort_by { |d| d["count"] }.reverse

        expect(sorted.map.with_index { |d, i| d["count"] == search_results.dig(i, "count") }).to all(be true)
      end
    end

  end

end
