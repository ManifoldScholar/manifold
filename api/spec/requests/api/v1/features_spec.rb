# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Feature", type: :request do
  let(:resource) { FactoryBot.create(:feature) }

  path "/features" do
    it_behaves_like "an API index request", model: Feature
    it_behaves_like "an API create request", model: Feature, authorized_user: :admin
  end

  path "/features/{id}" do
    it_behaves_like "an API show request", model: Feature
    it_behaves_like "an API update request", model: Feature, authorized_user: :admin
    it_behaves_like "an API destroy request", model: Feature, authorized_user: :admin
  end
end
