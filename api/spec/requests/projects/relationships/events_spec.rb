# frozen_string_literal: true

RSpec.describe "Project Events API", type: :request do
  let_it_be(:project, refind: true) { FactoryBot.create(:project) }

  before do
    FactoryBot.create(:event, project: project, event_type: EventType[:tweet])
    FactoryBot.create(:event, project: project, event_type: EventType[:comment_created])
    FactoryBot.create(:event, project: project, event_type: EventType[:text_annotated])
    FactoryBot.create(:event, project: project, event_type: EventType[:resource_added])
  end

  describe "sends a list of project events" do
    let(:path) { api_v1_project_relationships_events_path(project) }
    before { get path }

    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(:ok)
      end
    end

    describe "the events returned" do
      it "do not include type comment_created or text_annotated" do
        api_response = response.parsed_body
        event_types = api_response["data"].map { |event| event.dig("attributes", "eventType") }
        expect(event_types).not_to include EventType[:comment_created], EventType[:text_annotated]
      end
    end
  end
end
