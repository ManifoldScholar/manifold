module Search
  # Wrapper class that can build field queries the way that
  # Searchkick does, with both fuzzy and boosted direct matching,
  # as well as our addition to support `match_phrase`.
  #
  # For fields that need to search nested content, a la `text_nodes.content`,
  # its interface will automatically use nested alternatives.
  #
  # rubocop:disable Metrics/MethodLength
  class FieldInfo < Types::FlexibleStruct
    include Search::AdvancedDSL

    attribute :name, Types::String
    attribute :raw_boost, Types::Coercible::Float
    attribute :fuzzy_multiplier, Types::Coercible::Float.default { 1.0 }
    attribute :multiplier, Types::Coercible::Float.default { 10.0 }
    attribute :phrase_multiplier, Types::Coercible::Float.default { 1000.0 }
    attribute :slop, Types::Coercible::Float.default { 2.0 }

    attribute? :nested_prefix, Types::String.optional

    # @!attribute [r] analyzed_name
    # The actual field to search against.
    # @return [String]
    memoize def analyzed_name
      [nested_prefix, name, "analyzed"].compact.join(".")
    end

    # @param [String] value
    # @param [Boolean] nested
    # @return [{ Symbol => Object }]
    def boosted_match(value, nested: nested?)
      return boosted_nested_match(value) if nested

      each_analyzer_and_fuzzy_value do |analyzer, is_fuzzy|
        extracted_match(analyzed_name) do |m|
          m.analyzer analyzer
          m.query value
          m.operator "and"

          if is_fuzzy
            m.boost fuzzy_boost
            m.fuzziness 1
            m.prefix_length 0
            m.max_expansions 3
            m.fuzzy_transpositions true
          else
            m.boost boost
          end
        end
      end
    end

    # @param [String] value
    # @param [Boolean] nested
    # @return [{ Symbol => Object }]
    def boosted_match_phrase(value, nested: nested?)
      return boosted_nested_match_phrase(value) if nested

      each_analyzer do |analyzer|
        extracted_match_phrase(analyzed_name) do |mp|
          mp.query value
          mp.analyzer analyzer
          mp.boost phrase_boost
          mp.slop slop
        end
      end
    end

    # @api private
    # @see #boosted_match
    # @param [String] value
    # @return [{ Symbol => Object }]
    def boosted_nested_match(value)
      query = extracted_bool_should boosted_match(value, nested: false)

      extracted_nested_for query
    end

    # @api private
    # @see #boosted_match_phrase
    # @param [String] value
    # @return [{ Symbol => Object }]
    def boosted_nested_match_phrase(value)
      query = extracted_bool_should boosted_match_phrase(value, nested: false)

      extracted_nested_for query
    end

    # @param [String] value
    # @param [Boolean] nested
    # @return [{ Symbol => Object }]
    def match(value, nested: nested?)
      return nested_match(value) if nested

      each_analyzer do |analyzer|
        extracted_match(analyzed_name) do |m|
          m.analyzer analyzer
          m.query value
          m.operator "and"
        end
      end
    end

    # @param [String] value
    # @param [Boolean] nested
    # @return [{ Symbol => Object }]
    def match_phrase(value, nested: nested?)
      return nested_match_phrase(value) if nested

      each_analyzer do |analyzer|
        extracted_match_phrase(analyzed_name) do |mp|
          mp.analyzer analyzer
          mp.query value
        end
      end
    end

    # Used to determine if a field is nested.
    def nested?
      nested_prefix.present?
    end

    # @api private
    # @see #match
    # @param [String] value
    # @return [{ Symbol => Object }]
    def nested_match(value)
      query = extracted_bool_should match(value, nested: false)

      extracted_nested_for query
    end

    # @api private
    # @see #match_phrase
    # @param [String] value
    # @return [{ Symbol => Object }]
    def nested_match_phrase(value)
      query = extracted_bool_should match_phrase(value, nested: false)

      extracted_nested_for query
    end

    private

    # @return [Float]
    def boost
      raw_boost * multiplier
    end

    # @return [Float]
    def fuzzy_boost
      raw_boost * fuzzy_multiplier
    end

    # @return [Float]
    def phrase_boost
      raw_boost * phrase_multiplier
    end

    # @param [{ Symbol => Object }] query
    # @return [{ Symbol => Object }]
    def build_inner_hits_for(query)
      default_inner_hits.deep_dup.tap do |h|
        h[:highlight][:fields][analyzed_name][:highlight_query] = query.deep_dup
      end
    end

    # @param [{ Symbol => Object }] query
    # @return [{ Symbol => Object }]
    def extracted_nested_for(query)
      raise "Requires nested prefix" unless nested?

      extracted_query do |q|
        q.nested do |n|
          n.ignore_unmapped true
          n.score_mode "max"
          n.path nested_prefix
          n.query query

          n.inner_hits build_inner_hits_for(query)
        end
      end
    end

    # @!attribute [r] default_inner_hits
    # @return [{ Symbol => Object }]
    memoize def default_inner_hits
      {}.tap do |h|
        h[:size] = 100

        h[:ignore_unmapped] = true

        h[:sort] = {
          "#{nested_prefix}.position": "asc"
        }

        h[:highlight] = {
          boundary_scanner: "sentence",
          type: "unified",
          pre_tags: %w[<mark>],
          post_tags: %w[</mark>],
          fields: {
            analyzed_name => {
              highlight_query: {},
              fragment_size: 250
            }
          }
        }
      end
    end
  end
  # rubocop:enable Metrics/MethodLength
end
