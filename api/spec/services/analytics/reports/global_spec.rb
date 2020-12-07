RSpec.describe Analytics::Reports::Global, interaction: true do

  def running_the_interaction!(**inputs)
    described_class.run!(allow_cached_result: false, **inputs)
  end
  alias_method :run_the_interaction!, :running_the_interaction!

  context "with visits" do
    let!(:visits) { FactoryBot.create_list(:analytics_visit, 10) }

      context "when run without arguments" do
      it "should return a valid result" do
        expect(described_class.run).to be_valid
      end

      it "should return results for all analytics" do
        analytics = running_the_interaction!.map { |h| h["name"] }

        expect(analytics.to_set).to eq described_class.analytics.map(&:to_s).to_set
      end

      it "should return a cached result after first run" do
        run_the_interaction!
        expect(described_class.run.cached_result).to be true
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
        expect(running_the_interaction!(analytics: pick_one).size).to be 1
      end
    end
  end

  context "with visits the last 10 days" do

    let!(:repeat_users) { FactoryBot.create_list(:user, 5) }
    let!(:single_visit_users) { FactoryBot.create_list(:user, 5) }

    let!(:visits) do
      visitor_tokens = repeat_users.each_with_object({}) { |u,h| h[u] = SecureRandom.uuid }
      today = Date.current

      repeat_visitors = 10.times.map do |t|
        repeat_users.map { |u| visit_for(u, visitor_tokens[u], today - t.days, (today - t.days) + 1.hour) }
      end

      single_visitors = single_visit_users.map { |u| visit_for(u, SecureRandom.uuid, today, today + 1.hour) }

      repeat_visitors.concat(single_visitors).flatten
    end

    context "with provided start and end dates" do
      let(:start_date) { 5.days.ago.to_date }
      let(:end_date) { 2.days.ago.to_date }

      it "should filter by provided dates" do
        result = run_the_interaction! start_date: start_date, end_date: end_date, analytics: [:daily_visitors]
        dataset = JSON.parse(result.find { |h| h["name"] == "daily_visitors" }["data"])

        expect(dataset.all? { |h| Chronic.parse(h["x"]).between?(start_date, end_date)}).to be true
      end
    end

    context "and relevant data in the database" do

      let!(:created_at) { { created_at: 10.days.ago } }

      let!(:projects) { FactoryBot.create_list(:project, 2, **created_at ) }
      let!(:texts) { projects.map { |p| FactoryBot.create_list(:text, 3, project: p, **created_at) }.flatten }
      let!(:text_sections) { texts.map { |t| FactoryBot.create_list(:text_section, 5, :with_simple_body, text: t, **created_at) }.flatten }
      let!(:annotations) do
        text_sections.map do |ts|
          [Annotation::TYPE_ANNOTATION, Annotation::TYPE_HIGHLIGHT].map { |f| FactoryBot.create_list(:annotation, 1, text_section: ts, format: f) }
        end.flatten
      end

      let!(:project_view_events) do
        projects.map do |p|
          visits.each do |visit|
            FactoryBot.create(:analytics_event, :completed_project_view, scope: p, visit: visit)
          end
        end.flatten
      end

      let!(:search_events) do
        10.times.map do
          FactoryBot.create(:analytics_event, name: "search", properties: { query: Faker::Lorem.word })
        end
      end

      let(:expected_values) do
        {
          returning_visitors: 0.5,
          average_visit_duration: "01:00:00.000000",
          top_projects: projects.map(&:name),
          active_users: 5,
          top_search_terms: search_events.pluck("properties ->> query")
        }
      end

      it "should be valid" do
        expect(described_class.run).to be_valid
      end

      xit "should have expected values" do

      end

    end
  end

end

def visit_for(user, visitor_token, start_time, end_time)
  FactoryBot.create(:analytics_visit, started_at: start_time, ended_at: end_time, user: user, visitor_token: visitor_token)
end
