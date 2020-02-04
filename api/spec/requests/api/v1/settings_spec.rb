require "swagger_helper"

RSpec.describe "Settings", type: :request do
  let(:resource) { Settings.instance }

  path "/settings" do
    include_examples "an API show request",
                     factory: :setting,
                     exclude: ["404"],
                     parameters: [],
                     resource_name: "Setting"

    include_examples "an API update request",
                     factory: :setting,
                     resource_name: "Setting",
                     request_id: false,
                     authorized_user: :admin
  end
end
