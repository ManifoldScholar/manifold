require "swagger_helper"

RSpec.describe "Analytics API", type: :request do

  let(:project) { FactoryBot.create(:project) }

  path "/analytics" do

    include_examples "an API show request",
                    model: Analytics::Reports::AnalyticsResult,
                    factory: :analytics_result,
                    resource_name: "analytics_result",
                    authorized_user: :admin,
                    exclude: ["404", "401"]
  end


end
