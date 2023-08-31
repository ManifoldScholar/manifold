require "swagger_helper"

RSpec.describe "Text Sections", type: :request do
  describe "when relating to a text" do
    let!(:text) { FactoryBot.create(:text) }
    let!(:resource) { FactoryBot.create(:text_section, text: text) }
    let(:text_id) { text.id }

    path "/texts/{text_id}/relationships/text_sections" do
      include_examples "an API index request",
                       model: TextSection,
                       parent: "text",
                       url_parameters: [:text_id]

     include_examples "an API create request",
                      model: TextSection,
                      parent: :text,
                      url_parameters: [:text_id],
                      authorized_user: :admin
    end

    path "/texts/{text_id}/relationships/text_sections/{id}" do
      include_examples "an API show request",
                       model: TextSection,
                       included_relationships: [:stylesheets],
                       url_parameters: [:text_id]
    end

    path "/text_sections/{id}" do
      include_examples "an API update request",
                       model: TextSection,
                       authorized_user: :admin

      include_examples "an API destroy request",
                       model: TextSection,
                       authorized_user: :admin
    end
  end
end
