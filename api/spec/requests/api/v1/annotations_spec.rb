# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Annotations", type: :request do
  before do
    TextSections::ExtrapolateNodes.new.call
  end

  path "/annotations/{id}" do
    include_examples "an API update request", model: Annotation, authorized_user: :admin
    include_examples "an API destroy request", model: Annotation, authorized_user: :admin
  end

  describe "for a text section" do
    let_it_be(:parent, refind: true) { FactoryBot.create(:text_section) }
    let_it_be(:text_section_id) { parent.id }
    let_it_be(:text_id) { parent.text.id }

    path "/texts/{text_id}/relationships/text_sections/{text_section_id}/annotations" do
      include_examples "an API index request",
                       parent: "text section",
                       model: Annotation,
                       url_parameters: [:text_section_id, :text_id]
    end

    path "/text_sections/{text_section_id}/relationships/annotations" do
      include_examples "an API create request",
                       parent: "text section",
                       model: Annotation,
                       url_parameters: [:text_section_id],
                       authorized_user: :admin
    end

    path "/text_sections/{text_section_id}/relationships/annotations/{id}" do
      include_examples "an API update request",
                       parent: "text section",
                       model: Annotation,
                       url_parameters: [:text_section_id],
                       authorized_user: :admin
    end
  end

  describe "for me" do
    let_it_be(:text, refind: true) { FactoryBot.create :text }
    let_it_be(:text_section, refind: true) { FactoryBot.create(:text_section, text: text) }
    let_it_be(:annotation, refind: true) do
      FactoryBot.create(:annotation, creator: admin, text_section: text_section)
    end

    path "/me/relationships/annotations" do
      let!(:'filter[text]') { nil }

      include_examples "an API index request",
                       parent: "current user",
                       tags: "Me",
                       model: Annotation,
                       authorized_user: :admin,
                       included_relationships: [:creator],
                       additional_parameters: [
                         {
                           name: "filter[text]",
                           in: :query,
                           type: :string,
                           required: true
                         }
                       ]
    end
  end

  describe "for a reading group" do
    let_it_be(:parent, refind: true) { FactoryBot.create(:reading_group) }
    let_it_be(:annotation, refind: true) { FactoryBot.create(:annotation, reading_group: parent) }
    let_it_be(:reading_group_id) { parent.id }

    path "/reading_groups/{reading_group_id}/relationships/annotations" do
      include_examples "an API index request",
                       parent: "reading group",
                       model: Annotation,
                       url_parameters: [:reading_group_id],
                       paginated: true,
                       included_relationships: [:creator]
    end
  end

  context "when managing flagging" do
    let_it_be(:annotation, refind: true) { FactoryBot.create(:annotation, creator: admin) }
    let_it_be(:annotation_id) { annotation.id }
    let_it_be(:flag, refind: true) { FactoryBot.create(:flag, creator: admin, flaggable: annotation) }

    path "/annotations/{annotation_id}/relationships/flags" do
      include_examples "an API create request",
                       summary: "Flag the annotation for moderation",
                       model: Annotation,
                       authorized_user: :admin,
                       request_body: false,
                       url_parameters: [:annotation_id]

      include_examples "an API destroy request",
                       summary: "Unflag the annotation",
                       model: Annotation,
                       authorized_user: :admin,
                       url_parameters: [:annotation_id],
                       # this route is a special case where a destroy does not take an ID
                       parameters: [],
                       exclude: %(404),
                       delete_has_response_body: true,
                       success_response_code: "200"
    end
  end
end
