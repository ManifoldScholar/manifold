require "swagger_helper"

RSpec.describe "Settings", type: :request do

  let(:resource) { Settings.instance }

  path "/settings" do
    include_examples "an API show request",
                      factory: :setting,
                      exclude: ["404"],
                      parameters: [],
                      summary: "Returns the settings for the current instance of manifold",
                      resource_name: "Setting"

    include_examples "an API update request",
                      factory: :setting,
                      resource_name: "Setting",
                      summary: "Updates the settings for the current instance of manifold",
                      request_id: false,
                      authorized_user: :admin
  end
end
