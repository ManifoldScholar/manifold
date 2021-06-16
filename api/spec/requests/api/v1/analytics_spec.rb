require "swagger_helper"

RSpec.describe "Analytics API", type: :request do
  let(:project) { FactoryBot.create(:project) }

  path "/analytics/events" do
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
      let(:HTTP_VISIT_TOKEN) { "82e69a96-43f2-4fc8-914e-c9ef9d555919" }
      let(:HTTP_VISITOR_TOKEN) { "883d1769-4352-419c-839f-104406fd2d91" }
    end

    let(:start_date) { Date.current.yesterday }
    let(:end_date) { Date.current }
    let(:report_type) { "global" }
    let(:resource) { Analytics::Reports::Global.run(start_date: start_date, end_date: end_date).result }

    path "/analytics/reports" do
      include_examples "an API show request",
                       model: ::Analytics::Reports::AnalyticsResult,
                       success_response_code: 200,
                       exclude: %w(404),
                       additional_parameters: [
                         { name: "start_date", in: :query, type: :string },
                         { name: "end_date", in: :query, type: :string },
                         { name: "report_type", in: :query, type: :string }
                       ] do
        let(:body) do
          {
            data: {
              attributes: {
                reportType: "global"
              }
            }
          }
        end
      end
    end
  end
end
