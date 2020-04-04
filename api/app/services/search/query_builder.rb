module Search
  # Receives the parsed search components from {Search::Query#parse_search_components!}
  # along with its {Search::Options options} and uses those to produce a suitable set
  # of options for `Searchkick`, with a custom query body.
  #
  # @see https://github.com/ankane/searchkick#advanced-search
  class QueryBuilder < Types::FlexibleStruct
    include ActiveModel::Validations
    include Search::AdvancedDSL

    attribute :options, ::Search::Options.default { ::Search::Options.new }
    attribute :phrases, Types::Array.of(Types::String).default { [] }
    attribute :needle, Types::String.optional.default { nil }
    attribute :negated_needle, Types::String.optional.default { nil }
    attribute :negated_phrases, Types::Array.of(Types::String).default { [] }

    attribute :fields, Types::Array.of(Types.Instance(::Search::FieldInfo)).default { ::Search::Container[:"fields.all"] }

    delegate :apply_where_filters!, :apply_highlight!, :apply_indices_boost!,
             :apply_pagination!, :apply_select!, :searchkick_options,
             to: :options

    validate :must_have_something_to_search!

    # @!attribute [r] body
    # Heavily uses `elasticsearch-dsl` to build a query based on the way that searchkick does,
    # modified to allow us to distinguish between phrasal and keyword matching in the same query.
    #
    # The DSL calls used to build the query are broken out logically to keep overall methods
    # simple and focused.
    #
    # @see #apply_query!
    # @see Searchkick::Options#apply_highlight!
    # @see Searchkick::Options#apply_indices_boost!
    # @see Searchkick::Options#apply_pagination!
    # @see Searchkick::Options#apply_select!
    # @return [Elasticsearch::DSL::Search::Search]
    memoize def body
      search do |s|
        apply_query! s
        apply_highlight! s
        apply_indices_boost! s
        apply_pagination! s
        apply_select! s
      end
    end

    def has_needle?
      needle.present?
    end

    def has_negated_needle?
      negated_needle.present?
    end

    def has_negated_phrases?
      negated_phrases.any?
    end

    def has_phrases?
      phrases.any?
    end

    def has_something_to_search?
      has_needle? || has_phrases?
    end

    def has_something_to_exclude?
      has_negated_phrases? || has_negated_needle?
    end

    # Can be passed directly to `Searchkick.search`.
    #
    # @see #body
    # @see Search::Options#searchkick_options
    # @return [{ Symbol => Object }]
    def to_search_options
      searchkick_options.merge(body: body.to_hash)
    end

    private

    # @note This is where the bulk of the actual search occurs.
    # @see #apply_must_queries!
    # @see #apply_negated_needle!
    # @see #apply_negated_phrases!
    # @see Searchkick::Options#apply_where_filters!
    # @param [Elasticsearch::DSL::Search::Search] search
    # @return [void]
    def apply_query!(search)
      search.query do |q|
        q.bool do |b|
          apply_must_queries! b

          apply_where_filters! b

          apply_negated_needle! b
          apply_negated_phrases! b
        end
      end
    end

    # Builds a `dis_max` search under `bool: must`.
    #
    # @see #build_queries_for_needle_match
    # @see #build_queries_for_phrases_match
    # @param [Elasticsearch::DSL::Search::Queries::Bool] bool
    # @return [void]
    def apply_must_queries!(bool)
      queries = (build_queries_for_needle_match + build_queries_for_phrases_match).flatten

      bool.must do |bm|
        bm.dis_max do |dm|
          dm.queries queries
        end
      end
    end

    # @note Does not seem to work. Negated phrases do, though
    # @param [Elasticsearch::DSL::Search::Queries::Bool] bool
    # @return [void]
    def apply_negated_needle!(bool)
      return if negated_needle.blank?

      queries = fields.flat_map do |field|
        field.match negated_needle
      end

      queries.each do |query|
        bool.must_not query
      end
    end

    # Allows us to accept something like `"will be with you" -"the force"`
    # in order to exclude documents that contain `"the force will be with you"`.
    #
    # @param [Elasticsearch::DSL::Search::Queries::Bool] bool
    # @return [void]
    def apply_negated_phrases!(bool)
      return if negated_phrases.blank?

      queries = negated_phrases.product(fields).flat_map do |(phrase, field)|
        field.match_phrase phrase
      end

      bool.must_not do |mn|
        mn.dis_max do |dm|
          dm.queries queries
        end
      end
    end

    # @return [<Hash>]
    def build_queries_for_needle_match
      return [] if needle.blank?

      fields.flat_map do |field|
        field.boosted_match needle
      end
    end

    # @return [<Hash>]
    def build_queries_for_phrases_match
      phrases.product(fields).flat_map do |(phrase, field)|
        field.boosted_match_phrase phrase
      end
    end

    # @return [void]
    def must_have_something_to_search!
      return if has_something_to_search?

      errors.add :base, "must have phrases or a needle"
    end
  end
end
