# frozen_string_literal: true

module Search
  # Site-wide search across multiple models though {PgSearch::Document}s.
  #
  # @see MultisearchDocumentEnhancement::ClassMethods#faceted_search_for
  class Query < ActiveInteraction::Base
    string :keyword

    boolean :debug, default: proc { Rails.env.development? }
    boolean :raise_search_errors, default: proc { Rails.env.development? }

    integer :page_number, default: 1

    integer :per_page, default: 20

    array :facets, default: [] do
      string
    end

    record :project, default: nil
    record :text, default: nil
    record :text_section, default: nil

    # @return [ActiveRecord::Relation<PgSearch::Document>]
    def execute
      options = {
        facets:,
        project:,
        text:,
        text_section:,
      }

      results = PgSearch::Document.faceted_search_for(keyword, **options)
        .page(page_number).per(per_page)

      eager_load_text_node_hits_within! results

      return results
    end

    private

    # @param [ActiveRecord::Relation<PgSearch::Document>] results
    # @return [void]
    def eager_load_text_node_hits_within!(results)
      text_section_ids = results.records.map(&:text_section_id).compact_blank.uniq

      text_node_hits = TextSectionNode.hit_search_for(keyword, text_section_ids:)

      results.records.each do |record|
        record.assign_text_node_hits!(keyword, text_node_hits)
      end
    end
  end
end
