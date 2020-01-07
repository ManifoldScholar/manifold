require "swagger_helper"

RSpec.describe "Feature", type: :request do

  let(:resource) { FactoryBot.create(:feature) }

  path "/features" do
    include_examples "an API index request", model: Feature
    include_examples "an API create request", model: Feature, authorized_user: :admin
  end

  path "/features/{id}" do
    include_examples "an API show request", model: Feature
    include_examples "an API update request", model: Feature, authorized_user: :admin
    include_examples "an API destroy request", model: Feature, authorized_user: :admin
  end
end
