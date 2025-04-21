# frozen_string_literal: true

module Search
  # Parse a search string along with some options and return {Search::Results results}, if any.
  #
  # @see https://github.com/ankane/searchkick#advanced-search
  # @see https://github.com/bruce/keyword_search
  class Query < ActiveInteraction::Base
    extend Memoist

    string :keyword

    boolean :debug, default: proc { Rails.env.development? }
    boolean :raise_search_errors, default: proc { Rails.env.development? }
    boolean :use_pg_search, default: proc { ManifoldSearchConfig.use_pg_search? }

    integer :page_number, default: 1

    integer :per_page, default: 20

    array :facets, default: [] do
      string
    end

    record :project, default: nil
    record :text, default: nil
    record :text_section, default: nil

    # @return [ActiveRecord::Relation<PgSearch::Document>] if strategy is pg
    # @return [Search::Results] if elasticsearch
    def execute
      if use_pg_search
        search_via_postgres
      else
        results = search_via_elasticsearch

        ::Search::Results.new results
      end
    end

    private

    def search_via_postgres
      options = {
        facets: facets,
        project: project,
        text: text,
        text_section: text_section,
      }

      PgSearch::Document.faceted_search_for(keyword, **options)
        .page(page_number).per(per_page)
    end

    # @return [Searchkick::Results]
    def search_via_elasticsearch
      return empty_resultset if keyword.blank?

      parse_search_components!

      query_builder = Search::QueryBuilder.new search_components

      searchkick_options = query_builder.to_search_options

      # We call `#blank?` to ensure the results are eager-loaded to trigger an exception where necessary.
      # This is necessary because newer versions of Searchkick lazy-load the results and we want to know about them now.
      Searchkick.search(searchkick_options).tap(&:blank?)
    rescue Searchkick::InvalidQueryError => e
      raise e if raise_search_errors

      return empty_resultset
    end

    # Populates {#search_components} via `KeywordSearch`.
    #
    # @return [void]
    def parse_search_components!
      KeywordSearch.search keyword do |with|
        with.default_keyword :text_content

        with.keyword :text_content do |values, positive|
          phrases, words = values.partition do |value|
            # if it contains a space, it was a quoted string
            " ".in?(value)
          end

          search_components[positive ? :phrases : :negated_phrases] += phrases
          search_components[positive ? :needle : :negated_needle] = words.join(" ").presence
        end
      end
    rescue KeywordSearch::ParseError
      search_components[:needle] = keyword
    end

    # @!attribute [r] search_components
    # @return [Hash]
    memoize def search_components
      { options: options, phrases: [], needle: nil, negated_phrases: [], negated_needle: nil }
    end

    # @!attribute [r] options
    # @return [Search::Options]
    memoize def options
      attributes = inputs.slice(:page_number, :per_page, :facets, :project, :text, :text_section, :debug)

      Search::Options.new attributes
    end

    # @return [Searchkick::Results]
    def empty_resultset
      fake_response = {
        "hits" => {
          "hits" => [],
          "total" => 0
        }
      }

      fake_options = inputs.slice(:per_page).merge(page: page_number)

      Searchkick::Results.new nil, fake_response, fake_options
    end
  end
end
