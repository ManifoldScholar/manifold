require "swagger_helper"

RSpec.describe "Categories API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:subject) { FactoryBot.create(:category, role: Category::ROLE_TEXT) }
  let(:id) { subject.id }

  path "/categories/{id}" do
    include_examples "an API show request", model: Category
    include_examples "an API update request", model: Category
    include_examples "an API destroy request", model: Category
  end

  describe "updates a text" do

    it_should_behave_like "orderable api requests" do
      let(:path) { "api_v1_category_path" }
      let!(:object_a) { FactoryBot.create(:category, position: 1) }
      let!(:object_b) { FactoryBot.create(:category, position: 2, project: object_a.project) }
    end
  end
end
