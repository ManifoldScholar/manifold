require "swagger_helper"

RSpec.describe "Analytics API", type: :request do
  let(:project) { FactoryBot.create(:project) }

  path "/analytics" do
    include_examples "an API create request",
                     model: Analytics::Event,
                     response_body: false,
                     additional_parameters: [
                       { name: "HTTP_VISIT_TOKEN", in: :header, type: :string },
                       { name: "HTTP_VISITOR_TOKEN", in: :header, type: :string }
                     ],
                     success_response_code: 204,
                     success_description: "No body returned for response" do
      let(:body) do
        {
          data: {
            attributes: {
              name: "view resource",
              recordType: "Project",
              recordId: project.id
            }
          }
        }
      end
      let(:HTTP_VISIT_TOKEN) { "11111111-1111-1111-1111-11111111111" }
      let(:HTTP_VISITOR_TOKEN) { "22222222-2222-2222-2222-222222222222" }
    end

    # include_examples "an API show request",
    #                 model: Analytics::Reports::AnalyticsResult,
    #                 factory: :analytics_result,
    #                 resource_name: "analytics_result",
    #                 authorized_user: :admin,
    #                 exclude: ["404", "401"]
  end
end
