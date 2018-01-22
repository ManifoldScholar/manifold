require "active_interaction"

module Search
  class Reader < ActiveInteraction::Base

    string :keyword
    integer :page_number, default: 1
    integer :per_page, default: 20
    array :facets, default: ["SearchableNode"]
    with_options default: nil do
      record :project
      record :text
      record :text_section
    end

    def execute
      out = Results.new(Searchkick.search(keyword, search_options))
      out
    end

    private

    def search_options
      {
        index_name: search_indexes,
        load: false,
        page: page_number,
        per_page: per_page,
        where: where,
        fields: [:body],
        highlight: highlight_options,
        debug: Rails.env.development?,
        request_params: { search_type: search_type }
      }
    end

    def highlight_options
      {
        fields: {
          body: {
            fragment_size: 250,
            boundary_scanner: "sentence"
          }
        }
      }
    end

    def where
      ids = included_text_section_ids
      return {} if ids.empty?
      { text_section_id: ids }
    end

    def text_section_ids_for_project
      return [] unless project
      TextSection.joins(text: :project).where("projects.id = ?", project.id).pluck(:id)
    end

    def text_section_ids_for_text
      return [] unless text
      text.text_sections.pluck(:id)
    end

    def included_text_section_ids
      text_section_ids = []
      text_section_ids.push(*text_section_ids_for_project)
      text_section_ids.push(*text_section_ids_for_text)
      text_section_ids << text_section.id if text_section
      text_section_ids
    end

    def search_type
      facets.include?(Annotation) ? "dfs_query_then_fetch" : "query_then_fetch"
    end

    def search_indexes
      indexes = []
      indexes.push SearchableNode if (facets & %w[SearchableNode All]).present?
      indexes.push Annotation if (facets & %w[Annotation All]).present?
      indexes
    end

  end
end
