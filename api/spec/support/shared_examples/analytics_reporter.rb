# frozen_string_literal: true

RSpec.shared_context "with analytics visits" do
  let_it_be(:admin) { FactoryBot.create(:user, :admin) }

  def running_the_interaction!(**inputs)
    report_scope = try(:scope)

    described_class.run!(
      resource: try(:scope),
      allow_cached_result: false,
      user: admin, **inputs
    )
  end

  alias_method :run_the_interaction!, :running_the_interaction!

  def running_the_interaction(**inputs)
    report_scope = try(:scope)

    described_class.run(
      resource: try(:scope),
      allow_cached_result: false,
      user: admin, **inputs
    )
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

  let_it_be(:single_visitor_count) { 2 }
  let_it_be(:single_visitors) { Timecop.freeze { FactoryBot.create_list(:user, single_visitor_count) } }
  let_it_be(:repeat_visitor_count) { 2 }
  let_it_be(:repeat_visitors) { Timecop.freeze { FactoryBot.create_list(:user, repeat_visitor_count) } }
  let_it_be(:active_visitors) { repeat_visitors }

  let_it_be(:visitor_count) { single_visitor_count + repeat_visitor_count }

  let_it_be(:visit_days) { 3 }
  let_it_be(:visit_duration) { 1.hour }

  let_it_be(:tokens) do
    Timecop.freeze do
      repeat_visitors.each_with_object({}) { |u, h| h[u] = SecureRandom.uuid }
        .merge(single_visitors.each_with_object({}) { |u, h| h[u] = SecureRandom.uuid })
    end
  end

  let_it_be(:visits) do
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

RSpec.shared_context "with projects" do
  include_context "with analytics visits"

  let_it_be(:reading_group) { FactoryBot.create(:reading_group) }

  let_it_be(:created_at) { { created_at: 2.days.ago } }

  let_it_be(:project_count) { 2 }
  let_it_be(:projects) { FactoryBot.create_list(:project, project_count, **created_at) }

  let_it_be(:text_count) { 2 }
  let_it_be(:texts) { projects.map { |p| FactoryBot.create_list(:text, text_count, project: p, **created_at) }.flatten }

  let_it_be(:text_section_count) { 2 }

  let_it_be(:text_sections) do
    texts.map do |t|
      FactoryBot.create_list(:text_section, 5, :with_simple_body, text: t, **created_at)
    end.flatten
  ensure
    texts.each(&:reload)
  end

  let(:actual_projects_count) { projects.size }
  let(:actual_projects) { projects.take(actual_projects_count) }
  let(:actual_texts_count) { texts.size }
  let(:actual_texts) { texts.take(actual_texts_count) }

  let(:actual_text_sections) { actual_texts.flat_map(&:text_sections) }
  let(:actual_text_sections_count) { actual_text_sections.count }

  let(:per_group_annotations_count) { actual_text_sections_count * active_visitors.count }

  let_it_be(:annotations) do
    text_sections.map do |text_section|
      active_visitors.map do |user|
        [true, false].map do |prv|
          [reading_group.id, nil].map do |reading_group_id|
            [Annotation::TYPE_ANNOTATION, Annotation::TYPE_HIGHLIGHT].map do |format|
              FactoryBot.create(
                :annotation,
                text_section: text_section,
                format: format,
                creator: user,
                private: prv,
                reading_group_id: reading_group_id,
                **created_at
              )
            end
          end
        end
      end
    end.flatten
  end

  let_it_be(:views_per_day_count) { 5 }
  let_it_be(:project_view_events) do
    projects.map do |p|
      visits.map do |visit|
        views_per_day_count.times.map do |i|
          FactoryBot.create(:analytics_event, :completed_project_view, record: p, visit: visit, time: i.days.ago)
        end
      end
    end.flatten
  end

  let_it_be(:project_favorites_count) { 2 }

  let_it_be(:favorites) do
    single_visitors.flat_map do |user|
      projects.flat_map do |project|
        FactoryBot.create_list(:favorite, project_favorites_count, favoritable: project, user: user, **created_at) rescue nil
      end
    end.compact
  end
end

RSpec.shared_context "with a single project" do
  include_context "with projects"

  let_it_be(:project) { projects.first }
  let_it_be(:previous_favorite_count) { 1 }
  let_it_be(:previous_favorites) { FactoryBot.create_list(:favorite, previous_favorite_count, favoritable: project, created_at: 100.days.ago) }

  let(:actual_projects_count) { 1 }

  let(:actual_texts_count) { project.texts.size }
end

RSpec.shared_context "with a single text" do
  include_context "with a single project"

  let_it_be(:text_count) { 1 }
  let_it_be(:text) { texts.first }
  let_it_be(:text_section) { text.text_sections.first }

  let(:actual_texts_count) { 1 }

  let_it_be(:text_view_event_count) { 2 }
  let_it_be(:text_view_events) do
    visits.map do |visit|
      FactoryBot.create_list(:analytics_event, text_view_event_count, :completed_text_view, record: text, visit: visit, time: visit.started_at)
    end
  end

  let(:text_section_view_event_count) { visits.count * actual_text_sections.count }

  let_it_be(:text_section_view_events) do
    visits.map do |visit|
      text_sections.map do |text_section|
        FactoryBot.create(:analytics_event, :completed_text_section_view, record: text_section, visit: visit, time: visit.started_at)
      end
    end.flatten
  end

  let(:share_count) { visits.count * actual_text_sections.count }

  let_it_be(:share_action) { Faker::Lorem.word }
  let_it_be(:text_section_shares) do
    visits.map do |visit|
      text_sections.map do |text_section|
        FactoryBot.create(:analytics_event, visit: visit, name: Analytics::Event.event_name_for(:share, TextSection), properties: { "action" => share_action, "text_section" => text_section.id })
      end
    end.flatten
  end

  let(:citation_count) { visits.count * actual_text_sections.count }

  let_it_be(:text_section_citations) do
    visits.map do |visit|
      text_sections.map do |text_section|
        FactoryBot.create(:analytics_event, visit: visit, name: Analytics::Event.event_name_for(:cite, TextSection), properties: { "text_section" => text_section.id })
      end
    end.flatten
  end
end

RSpec.shared_examples_for "analytics reporter visits" do
  context "with visits" do
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

RSpec.shared_examples_for "analytics reporter events" do
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
    rescue Exception => e

      raise e
    end
  end
end
