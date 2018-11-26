require "active_interaction"

module Search
  class Query < ActiveInteraction::Base

    string :keyword
    integer :page_number, default: 1
    integer :per_page, default: 20
    array :facets, default: []
    with_options default: nil do
      record :project
      record :text
      record :text_section
    end

    ALLOWED_FACETS = %w(Project Resource Text SearchableNode Annotation).freeze

    def execute
      Results.new(Searchkick.search(keyword, search_options))
    end

    private

    def search_options
      {
        index_name: search_indexes,
        indices_boost: indices_ranking,
        load: false,
        debug: Rails.env.development?,
        page: page_number,
        per_page: per_page,
        where: where,
        fields: metadata_fields +
          [:maker_names, :caption, :title_values, :text_titles, :title, :body],
        highlight: highlight_options,
        request_params: { search_type: search_type }
      }
    end

    def metadata_fields
      (
        Project.metadata_properties +
        Text.metadata_properties +
        Resource.metadata_properties
      ).uniq.map { |p| "metadata.#{p}" }
    end

    def highlight_options
      {
        tag: '<span class="highlight">',
        fields: {
          body: {
            fragment_size: 250,
            boundary_scanner: "sentence"
          },
          title: {
            fragment_size: 250,
            boundary_scanner: "sentence"
          }
        }
      }
    end

    def where
      where = { hidden: false }
      where[:text_section_id] = text_section.id if text_section
      where[:text_id] = text.id if text
      where[:project_id] = project.id if project
      where
    end

    def search_type
      facets.include?(Annotation) ? "dfs_query_then_fetch" : "query_then_fetch"
    end

    def search_indexes
      indexes = []
      return indexes unless facets.any?
      facets.each do |facet|
        indexes.push facet.safe_constantize if ALLOWED_FACETS.include? facet
      end
      indexes
    end

    def indices_ranking
      {
        Project => 50,
        Text => 30,
        Resource => 15,
        Annotation => 10,
        SearchableNode => 1
      }
    end

  end
end
