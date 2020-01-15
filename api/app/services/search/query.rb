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

    ALLOWED_FACETS = %w(Project Resource Text TextSection Annotation).freeze

    def execute
      res = Searchkick.search(keyword, search_options) do |body|
        query_groups = body[:query][:bool][:must][:bool][:should]
        queries = query_groups.map { |item| item[:dis_max][:queries] }.flatten
        queries.push(full_text_query)
      end
      Results.new(res)
    end

    private

    # rubocop:disable Metrics/MethodLength
    def text_node_query
      {
        "bool": {
          "should": [
            {
              "match": {
                "text_nodes.content.analyzed": {
                  query: keyword,
                  boost: 0,
                  analyzer: "searchkick_search",
                  fuzziness: 1,
                  prefix_length: 0,
                  max_expansions: 3,
                  fuzzy_transpositions: true
                }
              }
            },
            {
              "match": {
                "text_nodes.content.analyzed": {
                  query: keyword,
                  boost: 10,
                  analyzer: "searchkick_search"
                }
              }
            },
            {
              "match": {
                "text_nodes.content.analyzed": {
                  query: keyword,
                  boost: 10,
                  analyzer: "searchkick_search2"
                }
              }
            }
          ]
        }
      }
    end
    # rubocop:enable Metrics/MethodLength

    # rubocop:disable Metrics/MethodLength
    def full_text_query
      {
        "nested": {
          "ignore_unmapped": true,
          "score_mode": "max",
          "path": "text_nodes",
          "query": text_node_query,
          "inner_hits": {
            "size": 100,
            "ignore_unmapped": true,
            "sort": { "text_nodes.position": "asc" }, # Oddly, if set the score is missing.
            "highlight": {
              "type": "unified",
              "pre_tags": [
                "<mark>"
              ],
              "post_tags": [
                "</mark>"
              ],
              "boundary_scanner": "sentence",
              "fields": {
                "text_nodes.content.analyzed": {
                  highlight_query: text_node_query,
                  "fragment_size": 250
                }
              }
            }
          }
        }
      }
    end
    # rubocop:enable Metrics/MethodLength

    # rubocop:disable Metrics/MethodLength
    def search_options
      {
        index_name: search_indexes,
        load: false,
        debug: Rails.env.development?,
        explain: false,
        page: page_number,
        per_page: per_page,
        select: {
          exclude: [:text_nodes]
        },
        where: where,
        indices_boost: indices_boost,
        fields: ["title^50", "full_text^40", "makers^30", "keywords^30", "parent_keywords^10"],
        highlight: highlight_options,
        request_params: { search_type: search_type },
        body_options: {

        }
      }
    end
    # rubocop:enable Metrics/MethodLength

    # rubocop:disable Metrics/MethodLength
    def highlight_options
      {
        tag: "<mark>",
        fields: {
          parent_keywords: {
            fragment_size: 250,
            boundary_scanner: "word",
            require_field_match: true
          },
          keywords: {
            fragment_size: 250,
            boundary_scanner: "word",
            require_field_match: true
          },
          makers: {
            fragment_size: 250,
            boundary_scanner: "word",
            require_field_match: false
          },
          full_text: {
            fragment_size: 250,
            boundary_scanner: "sentence",
            require_field_match: true
          },
          title: {
            fragment_size: 250,
            require_field_match: true
          }
        }
      }
    end
    # rubocop:enable Metrics/MethodLength

    def where
      where = { hidden: false }
      where[:_id] = text_section.id if text_section
      where[:parent_text] = text.id if text
      where[:parent_project] = project.id if project
      where
    end

    def search_type
      facets.include?(Annotation) ? "dfs_query_then_fetch" : "query_then_fetch"
    end

    def search_indexes
      indexes = []
      return ALLOWED_FACETS.map(&:safe_constantize) unless facets.any?

      facets.each do |facet|
        indexes.push facet.safe_constantize if ALLOWED_FACETS.include? facet
      end
      indexes
    end

    def indices_boost
      {
        Project => 50,
        Text => 40,
        Resource => 30,
        Annotation => 20,
        TextSection => 10
      }
    end

  end
end
