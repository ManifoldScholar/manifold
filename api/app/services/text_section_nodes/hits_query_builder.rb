# frozen_string_literal: true

module TextSectionNodes
  class HitsQueryBuilder
    include QueryOperation
    include Dry::Core::Constants
    include Dry::Monads[:result]
    include Dry::Initializer[undefined: false].define -> do
      option :keyword, Types::Coercible::String, default: proc { "" }

      option :text_section_ids, Types::TextSectionIDs, default: proc { EMPTY_ARRAY }
    end

    QUERY = <<~SQL
    WITH search_results AS MATERIALIZED (
      SELECT
        "text_section_nodes".*,
        (
          ts_rank_cd(
            ("text_section_nodes"."tsv_contained_content"),
            (
              websearch_to_tsquery('english', immutable_unaccent (%<keyword>s))
            ),
            7
          )
        ) AS rank
      FROM
        "text_section_nodes"
      WHERE
        "text_section_nodes"."current"
        AND
        %<in_text_section_ids>s
        AND (
          (
            immutable_unaccent (%<keyword>s) %% (
              immutable_unaccent (
                coalesce(
                  "text_section_nodes"."contained_content"::text,
                  ''
                )
              )
            )
          )
          OR
          (
            ("text_section_nodes"."tsv_contained_content") @@ (
              websearch_to_tsquery('english', immutable_unaccent (%<keyword>s))
            )
          )
        )
    ), node_hits AS (
      SELECT
        search_results.*,
        search_results.rank AS pg_search_rank,
        row_number() OVER (
          PARTITION BY
            "search_results"."text_section_id"
          ORDER BY
            search_results.rank DESC,
            "search_results"."node_indices" DESC,
            "search_results"."id" ASC
        ) AS hit_number
      FROM
        search_results
    )
    SELECT
      *
      ,
      ts_headline(
        'english',
        "node_hits"."contained_content",
        (
          websearch_to_tsquery('english', immutable_unaccent (%<keyword>s))
        ),
        'StartSel = "<mark>", StopSel = "</mark>", MaxFragments = 3, MaxWords = 80, MinWords = 12, ShortWord = 4, FragmentDelimiter = "&hellip;", HighlightAll = FALSE'
      ) AS content_highlighted
    FROM node_hits
    ORDER BY
      "node_hits"."text_section_id" ASC,
      "node_hits"."pg_search_rank" DESC,
      "node_hits"."hit_number" ASC;
    SQL

    # @return [String]
    attr_reader :query

    # @return [{ Symbol => String }]
    attr_reader :query_options

    # @return [Dry::Monads::Success(String)]
    def call
      prepare!

      Success query
    end

    private

    # @return [void]
    def prepare!
      @query_options = build_query_options

      @query = QUERY % query_options
    end

    def build_query_options
      {}.tap do |opts|
        opts[:in_text_section_ids] = build_in_text_section_ids
        opts[:keyword] = quote_value(keyword)
      end
    end

    def build_in_text_section_ids
      if text_section_ids.present?
        TextSectionNode.arel_table[:text_section_id].in(text_section_ids).to_sql
      else
        "FALSE"
      end
    end
  end
end
