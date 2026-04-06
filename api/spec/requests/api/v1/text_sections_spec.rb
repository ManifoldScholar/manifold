# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Text Sections", type: :request do
  describe "when relating to a text" do
    let!(:text) { FactoryBot.create(:text) }
    let!(:resource) { FactoryBot.create(:text_section, text: text) }
    let(:text_id) { text.id }

    path "/texts/{text_id}/relationships/text_sections" do
      it_behaves_like "an API index request",
                       model: TextSection,
                       parent: "text",
                       url_parameters: [:text_id]

      it_behaves_like "an API create request",
                       model: TextSection,
                       parent: :text,
                       url_parameters: [:text_id],
                       authorized_user: :admin
    end

    path "/texts/{text_id}/relationships/text_sections/{id}" do
      it_behaves_like "an API show request",
                       model: TextSection,
                       included_relationships: [:stylesheets],
                       url_parameters: [:text_id]
    end

    path "/text_sections/{id}" do
      it_behaves_like "an API update request",
                       model: TextSection,
                       authorized_user: :admin

      it_behaves_like "an API destroy request",
                       model: TextSection,
                       authorized_user: :admin
    end
  end
end
