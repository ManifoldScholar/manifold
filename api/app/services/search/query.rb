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
        facets: facets,
        project: project,
        text: text,
        text_section: text_section,
      }

      PgSearch::Document.faceted_search_for(keyword, **options)
        .page(page_number).per(per_page)
    end
  end
end
