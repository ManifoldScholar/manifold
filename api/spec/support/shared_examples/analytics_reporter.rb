require "rails_helper"

shared_context "with analytics visits" do
  def running_the_interaction!(**inputs)
    report_scope = defined?(scope) ? scope : nil
    described_class.run!(resource: report_scope, allow_cached_result: false, user: admin, **inputs)
  end
  alias_method :run_the_interaction!, :running_the_interaction!

  def running_the_interaction(**inputs)
    report_scope = defined?(scope) ? scope : nil
    described_class.run(resource: report_scope, allow_cached_result: false, user: admin, **inputs)
  end
  alias_method :run_the_interaction, :running_the_interaction

  def visit_for(visitor_token, start_time, end_time)
    FactoryBot.create(:analytics_visit, started_at: start_time, ended_at: end_time, visitor_token: visitor_token)
  end

  def build_expected_daily_visitors(from_date: Date.yesterday)
    max_offset = visit_days - 1

    max_offset.downto(0).map do |offset|
      day = from_date - offset.days

      result = {}.tap do |res|
        res["x"] = day.to_s
        res["y"] = offset == 0 ? visitor_count : repeat_visitor_count
      end
    end
  end

  let(:single_visitor_count) { 2 }
  let!(:single_visitors) { Timecop.freeze { FactoryBot.create_list(:user, single_visitor_count) } }
  let(:repeat_visitor_count) { 2 }
  let!(:repeat_visitors) { Timecop.freeze { FactoryBot.create_list(:user, repeat_visitor_count) } }
  let(:active_visitors) { repeat_visitors }

  let(:visitor_count) { single_visitor_count + repeat_visitor_count }

  let(:visit_days) { 3 }
  let(:visit_duration) { 1.hour }

  let(:tokens) do
    Timecop.freeze do
      repeat_visitors.each_with_object({}) { |u, h| h[u] = SecureRandom.uuid }
        .merge(single_visitors.each_with_object({}) { |u, h| h[u] = SecureRandom.uuid })
    end
  end

  let!(:visits) do
    Timecop.freeze do
      yesterday = 1.day.ago

      repeat_visits = visit_days.times.map do |t|
        ago = t.days
        repeat_visitors.map { |u| visit_for(tokens[u], yesterday - ago, (yesterday - ago) + visit_duration) }
      end

      single_visits = single_visitors.map { |u| visit_for(tokens[u], yesterday, yesterday + visit_duration) }

      (repeat_visits + single_visits).flatten
    end
  end
end

shared_context "with projects" do
  let(:created_at) { { created_at: 2.days.ago } }

  let(:project_count) { 2 }
  let!(:projects) { FactoryBot.create_list(:project, project_count, **created_at) }

  let(:text_count) { 2 }
  let!(:texts) { projects.map { |p| FactoryBot.create_list(:text, text_count, project: p, **created_at) }.flatten }

  let(:text_section_count) { 2 }
  let!(:text_sections) { texts.map { |t| FactoryBot.create_list(:text_section, 5, :with_simple_body, text: t, **created_at) }.flatten }

  let(:reading_group) { FactoryBot.create(:reading_group) }

  let(:per_group_annotations_count) { text_sections.count * active_visitors.count }

  let!(:annotations) do
    text_sections.map do |text_section|
      active_visitors.map do |user|
        [true, false].map do |prv|
          [reading_group.id, nil].map do |reading_group|
            [Annotation::TYPE_ANNOTATION, Annotation::TYPE_HIGHLIGHT].map do |format|
              FactoryBot.create(:annotation,
                                text_section: text_section,
                                format: format,
                                creator: user,
                                private: prv,
                                reading_group_id: reading_group,
                                **created_at)
            end
          end
        end
      end
    end.flatten
  end

  let(:views_per_day_count) { 5 }
  let!(:project_view_events) do
    projects.map do |p|
      visits.map do |visit|
        views_per_day_count.times.map do |i|
          FactoryBot.create(:analytics_event, :completed_project_view, record: p, visit: visit, time: i.days.ago)
        end
      end
    end.flatten
  end

  let(:project_favorites_count) { 1 }
  let!(:favorites) do
    projects.map { |project| FactoryBot.create_list(:favorite, project_favorites_count, favoritable: project, **created_at) }
  end
end

shared_context "with a single project" do
  include_context "with projects"

  let(:project_count) { 1 }
  let(:projects) { FactoryBot.create_list(:project, project_count, **created_at) }

  let(:project) { projects.first }

  let(:text_count) { 1 }
  let(:texts) { FactoryBot.create_list(:text, text_count, project: project, **created_at) }

  let(:text_sections_count) { 2 }
  let(:text_sections) { texts.map { |t| FactoryBot.create_list(:text_section, text_sections_count, :with_simple_body, text: t, **created_at) }.flatten }

  let(:views_per_day_count) { 2 }

  let(:project_favorites_count) { 2 }

  let(:previous_favorite_count) { 1 }
  let(:previous_favorites) { FactoryBot.create_list(:favorite, previous_favorite_count, favoritable: project, created_at: 100.days.ago) }
end

shared_context "with a single text" do
  include_context "with a single project"

  let(:text_count) { 1 }
  let(:text) { texts.first }

  let(:text_view_event_count) { 2 }
  let(:text_view_events) do
    visits.map do |visit|
      FactoryBot.create_list(:analytics_event, text_view_event_count, :completed_text_view, record: text, visit: visit, time: visit.started_at)
    end
  end

  let(:text_section_view_event_count) { visits.count * text_sections.count }
  let(:text_section_view_events) do
    visits.map do |visit|
      text_sections.map do |text_section|
        FactoryBot.create(:analytics_event, :completed_text_section_view, record: text_section, visit: visit, time: visit.started_at)
      end
    end.flatten
  end

  let(:share_count) { visits.count * text_sections.count }
  let(:share_action) { Faker::Lorem.word }
  let!(:text_section_shares) do
    visits.map do |visit|
      text_sections.map do |text_section|
        FactoryBot.create(:analytics_event, visit: visit, name: Analytics::Event.event_name_for(:share, TextSection), properties: { "action" => share_action, "text_section" => text_section.id })
      end
    end.flatten
  end

  let(:citation_count) { visits.count * text_sections.count }
  let!(:text_section_citations) do
    visits.map do |visit|
      text_sections.map do |text_section|
        FactoryBot.create(:analytics_event, visit: visit, name: Analytics::Event.event_name_for(:cite, TextSection), properties: { "text_section" => text_section.id })
      end
    end.flatten
  end
end

shared_examples_for "analytics reporter visits" do
  let(:admin) { FactoryBot.create(:user, :admin) }

  context "with visits" do
    include_context "with analytics visits"

    context "when run without arguments" do
      it "should return a valid result" do
        expect(running_the_interaction).to be_valid
      end

      it "should return results for all analytics" do
        analytics = running_the_interaction!.data.map { |h| h["name"] }

        expect(analytics.to_set).to eq described_class.analytics.map(&:to_s).to_set
      end

      it "should return a cached result after first run" do
        run_the_interaction!
        expect(running_the_interaction(allow_cached_result: true).cached_result).to be true
      end
    end

    context "when run with a defined subset of analytics" do
      let(:selected_analytics) do
        rand(described_class.analytics.size - 1).times.map do |_i|
          described_class.analytics[rand(described_class.analytics.size - 1)]
        end
      end

      it "should return a subset of analytics if defined" do
        described_class.analytics.each do |analytic|
          expect(running_the_interaction!(analytics: [analytic]).data.size).to be 1
        end
      end
    end

    context "with provided start and end dates" do
      let(:start_date) { 5.days.ago.to_date }
      let(:end_date) { 2.days.ago.to_date }

      it "should filter by provided dates" do
        result = run_the_interaction! start_date: start_date, end_date: end_date, analytics: [:daily_visitors]
        dataset = result.result.find { |h| h["name"] == "daily_visitors" }["data"]

        expect(dataset.all? { |h| Chronic.parse(h["x"]).to_date.between?(start_date, end_date) }).to be true
      end
    end
  end
end

shared_examples_for "analytics reporter events" do
  let(:admin) { FactoryBot.create(:user, :admin) }

  include_context "with analytics visits"

  before(:each) do
    events
  end

  it "should be valid" do
    outcome = running_the_interaction
    expect(outcome).to be_valid
  end


  # Generating database state and running query is time-consuming, so run all expectations in one go
  # It is important that nothing in this proc mutates the database or result set
  it "should have expected values" do
    outcome = run_the_interaction!
    outcome.analytics.each do |name|
      report = outcome.result.find { |r| r["name"] == name.to_s }

      expected = expectations[name]
      actual = report["data"]

      case expected
      when Array
        expect(actual).to include(*expected)
      when Hash
        expect(actual.symbolize_keys).to include(**expected.symbolize_keys)
      else
        expect(actual).to eq expected
      end
    end
  end
end
