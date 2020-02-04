require "swagger_helper"

RSpec.describe "Text Sections", type: :request do
  describe "when relating to a text" do
    let(:text) { FactoryBot.create(:text) }
    let(:resource) { FactoryBot.create(:text_section, text: text) }
    let(:text_id) { text.id }

    path "/texts/{text_id}/relationships/text_sections" do
      include_examples "an API index request",
                       model: TextSection,
                       parent: "text",
                       url_parameters: [:text_id]
    end
  end

  path "/text_sections/{id}" do
    include_examples "an API show request",
                     model: TextSection,
                     included_relationships: [:stylesheets]
  end
end
