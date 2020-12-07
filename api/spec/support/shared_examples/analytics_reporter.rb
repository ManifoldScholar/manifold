require 'rails_helper'

shared_context "with analytics visits" do
  def running_the_interaction!(**inputs)
    report_scope = defined?(scope) ? scope : nil
    described_class.run!(scope: report_scope, allow_cached_result: false, **inputs)
  end
  alias_method :run_the_interaction!, :running_the_interaction!

  def running_the_interaction(**inputs)
    report_scope = defined?(scope) ? scope : nil
    described_class.run(scope: report_scope, allow_cached_result: false, **inputs)
  end
  alias_method :run_the_interaction, :running_the_interaction

  def visit_for(visitor_token, start_time, end_time)
    FactoryBot.create(:analytics_visit, started_at: start_time, ended_at: end_time, visitor_token: visitor_token)
  end

  Timecop.freeze do
    let!(:repeat_users) { FactoryBot.create_list(:user, 5) }
    let!(:single_visit_users) { FactoryBot.create_list(:user, 5) }

    let!(:visits) do
      visitor_tokens = repeat_users.each_with_object({}) { |u,h| h[u] = SecureRandom.uuid }
      today = Date.current

      repeat_visitors = 10.times.map do |t|
        repeat_users.map { |u| visit_for(visitor_tokens[u], today - t.days, (today - t.days) + 1.hour) }
      end

      single_visitors = single_visit_users.map { |u| visit_for(SecureRandom.uuid, today, today + 1.hour) }

      repeat_visitors.concat(single_visitors).flatten
    end
  end
end

shared_context "with projects" do
  let(:created_at) { { created_at: 2.days.ago } }

  let(:project_count) { 2 }
  let(:projects) { FactoryBot.create_list(:project, project_count, **created_at ) }

  let(:text_count) { 3 }
  let(:texts) { projects.map { |p| FactoryBot.create_list(:text, text_count, project: p, **created_at) }.flatten }

  let(:text_section_count) { 5 }
  let(:text_sections) { texts.map { |t| FactoryBot.create_list(:text_section, 5, :with_simple_body, text: t, **created_at) }.flatten }

  let(:annotations_count) { text_sections.count * repeat_users.count}
  let(:annotations) do
    text_sections.map do |ts|
      repeat_users.map do |u|
        [Annotation::TYPE_ANNOTATION, Annotation::TYPE_HIGHLIGHT].map { |f| FactoryBot.create_list(:annotation, 1, text_section: ts, format: f, creator: u, **created_at) }
      end
    end.flatten
  end

  let(:views_per_day_count) { 5 }
  let(:project_view_events) do
    projects.map do |p|
      visits.map do |visit|
        views_per_day_count.times.map do |i|
          FactoryBot.create(:analytics_event, :completed_project_view, record: p, visit: visit, time: i.days.ago)
        end
      end
    end.flatten
  end
end

shared_context "with a single project" do
  include_context "with projects"

  let(:project_count) { 1 }
  let(:project) { projects.first }

  let(:texts) { FactoryBot.create_list(:text, text_count, project: project, **created_at) }

  let(:text_sections_count) { 5 }
  let(:text_sections) { texts.map { |t| FactoryBot.create_list(:text_section, text_sections_count, :with_simple_body, text: t, **created_at) }.flatten }

  let(:annotations_count) { text_sections.count * repeat_users.count}
  let(:annotations) do
    text_sections.map do |ts|
      repeat_users.map do |u|
        [Annotation::TYPE_ANNOTATION, Annotation::TYPE_HIGHLIGHT].map { |f| FactoryBot.create_list(:annotation, 1, text_section: ts, format: f, creator: u, **created_at) }
      end
    end.flatten
  end

  let(:views_per_day_count) { 5 }
  let(:project_view_events) do
    visits.map do |visit|
      views_per_day_count.times do |i|
        FactoryBot.create(:analytics_event, :completed_project_view, record: project, visit: visit, time: i.days.ago)
      end
    end
  end

  let(:favorites_this_period_count) { 10 }
  let(:favorites) { FactoryBot.create_list(:favorite, favorites_this_period_count, favoritable: project, **created_at) }

  let(:previous_favorite_count) { 1 }
  let(:previous_favorites) { FactoryBot.create_list(:favorite, previous_favorite_count, favoritable: project, created_at: 20.days.ago) }
end

shared_context "with a single text" do
  include_context "with a single project"

  let(:text_count) { 1 }
  let(:text) { texts.first }

  let(:text_view_event_count) { 5 }
  let(:text_view_events) do
    visits.map do |visit|
      text_view_event_count.times do |i|
        FactoryBot.create(:analytics_event, :completed_text_view, record: text, visit: visit, time: i.days.ago)
      end
    end
  end

  let(:text_section_view_event_count) { 5 }
  let(:text_section_view_events) do
    visits.map do |visit|
      text_section_view_event_count.times.map do |i|
        text_sections.map do |text_section|
          FactoryBot.create(:analytics_event, :completed_text_section_view, record: text_section, visit: visit, time: i.days.ago)
        end
      end
    end
  end

end

shared_examples_for "analytics reporter visits" do

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
        (rand(described_class.analytics.size - 1)).times.map do |i|
          described_class.analytics[rand(described_class.analytics.size - 1)]
        end
      end

      it "should return a subset of analytics if defined" do
        pick_one = [described_class.analytics[rand(described_class.analytics.size - 1)]]
        expect(running_the_interaction!(analytics: pick_one).data.size).to be 1
      end
    end

    context "with provided start and end dates" do
      let(:start_date) { 5.days.ago.to_date }
      let(:end_date) { 2.days.ago.to_date }

      it "should filter by provided dates" do
        result = run_the_interaction! start_date: start_date, end_date: end_date, analytics: [:daily_visitors]
        dataset = result.data.find { |h| h["name"] == "daily_visitors" }["data"]

        expect(dataset.all? { |h| Chronic.parse(h["x"]).to_date.between?(start_date, end_date)}).to be true
      end
    end
  end
end

shared_examples_for "analytics reporter events" do
  include_context "with analytics visits"

  before(:each) do
    events
  end

  it "should be valid" do
    expect(running_the_interaction).to be_valid
  end

  it "should have expected values" do
    result = run_the_interaction!.data
    expectations.call(result)
  end

end
