# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Stylesheets", type: :request do
  included_relationships = [:text, :text_sections]

  path "/stylesheets/{id}" do
    it_behaves_like "an API show request",
                     model: Stylesheet,
                     included_relationships: included_relationships

    it_behaves_like "an API update request",
                     model: Stylesheet,
                     authorized_user: :admin,
                     included_relationships: included_relationships

    it_behaves_like "an API destroy request",
                     model: Stylesheet,
                     authorized_user: :admin
  end

  context "when relating to a text" do
    let(:resource) { FactoryBot.create(:stylesheet) }
    let(:text_id) { resource.text_id }

    path "/texts/{text_id}/relationships/stylesheets" do
      it_behaves_like "an API create request",
                       parent: "text",
                       model: Stylesheet,
                       url_parameters: [:text_id],
                       authorized_user: :admin
    end
  end
end
