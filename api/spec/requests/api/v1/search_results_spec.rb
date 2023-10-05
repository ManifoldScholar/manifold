require "swagger_helper"

RSpec.describe "Search Results", type: :request do
  context "can search a project", :elasticsearch do
    let!(:keyword) { "bananas" }
    let!(:text_resource) { FactoryBot.create(:text) }
    let!(:project_resource) { FactoryBot.create(:project, title: keyword, texts: [text_resource]) }

    around(:example) do |example|
      WebMock.disable_net_connect!(allow: [/127\.0\.0\.1:2?9200/, /localhost:2?9200/])
      Journal.reindex
      Text.reindex
      Resource.reindex
      Annotation.reindex
      TextSection.reindex
      example.run
    end

    path "/search_results" do
      let(:scope) { nil }
      let(:search_num) { nil }
      let(:all_facets) { true }
      let(:project) { project_resource.id }
      let(:text) { nil }
      let(:text_section) { nil }
      let(:'page[number]') { 1 }
      let(:'page[size]') { 10 }
      let(:raw) { nil }
      let(:facets) { [] }

      include_examples "an API index request",
                       factory: "foo",
                       resource_name: "SearchResult",
                       additional_parameters: [
                         { name: "keyword", in: :query, type: :string },
                         { name: "scope", in: :query, type: :string },
                         { name: "search_num", in: :query, type: :integer },
                         { name: "all_facets", in: :query, type: :boolean },
                         { name: "project", in: :query, type: :string, description: "ID of the project to search" },
                         { name: "text", in: :query, type: :string, description: "ID of the text to search" },
                         { name: "text_section", in: :query, type: :string, description: "ID of the text_section to search" },
                         { name: "page[number]", in: :query, type: :integer, description: "Which page of results you will receive" },
                         { name: "page[size]", in: :query, type: :integer, description: "How many results are in a page" },
                         { name: "raw", in: :query, type: :string },
                         { name: "facets", in: :query, type: :array }
                       ]
    end
  end
end
