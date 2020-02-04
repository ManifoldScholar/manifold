require "swagger_helper"

RSpec.describe "Stylesheets", type: :request do
  included_relationships = [:text, :text_sections]

  path "/stylesheets/{id}" do
    include_examples "an API show request",
                     model: Stylesheet,
                     included_relationships: included_relationships

    include_examples "an API update request",
                     model: Stylesheet,
                     authorized_user: :admin,
                     included_relationships: included_relationships

    include_examples "an API destroy request",
                     model: Stylesheet,
                     authorized_user: :admin
  end

  context "when relating to a text" do
    let(:resource) { FactoryBot.create(:stylesheet) }
    let(:text_id) { resource.text_id }

    path "/texts/{text_id}/relationships/stylesheets" do
      include_examples "an API create request",
                       parent: "text",
                       model: Stylesheet,
                       url_parameters: [:text_id],
                       authorized_user: :admin
    end
  end
end
