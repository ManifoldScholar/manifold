module Search
  # Helper class to build an `options` object for Searchkick.
  class Options < Types::FlexibleStruct
    FACET = Types::Coercible::String.enum("Project", "Journal", "Resource", "Text", "TextSection", "Annotation")
    DEFAULT_FACETS = FACET.options[:mapping].keys.freeze
    FACETS = Types::Array.of(FACET)
    FACETS_OPTION = FACETS.default { DEFAULT_FACETS.dup }.constructor do |value|
      Array(value).compact.presence || DEFAULT_FACETS.dup
    end

    INDICES_BOOST = {
      Project => 50,
      Journal => 50,
      Text => 40,
      Resource => 30,
      Annotation => 20,
      TextSection => 10
    }.freeze

    HIGHLIGHT_OPTIONS = {
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
    }.freeze

    attribute :phrase, Types::Bool.default { false }
    attribute :debug, Types::Bool.default { Rails.env.development? }
    attribute :execute, Types::Bool.default { true }
    attribute :load, Types::Bool.default { false }

    attribute? :page_number, Types::Coercible::Integer.constrained(gt: 0).default { 1 }
    attribute? :per_page, Types::Coercible::Integer.constrained(gt: 0).default { 20 }
    attribute? :padding, Types::Coercible::Integer.constrained(gteq: 0).default { 0 }
    attribute? :facets, FACETS_OPTION.default { DEFAULT_FACETS.dup }

    attribute? :project, Types.Instance(Project).optional
    attribute? :journal, Types.Instance(Journal).optional
    attribute? :text, Types.Instance(Text).optional
    attribute? :text_section, Types.Instance(TextSection).optional

    # @param [Elasticsearch::DSL::Search::Queries::Bool] bool
    # @return [void]
    def apply_where_filters!(bool)
      where_conditions.each do |attribute, value|
        bool.filter do
          term attribute => value
        end
      end
    end

    # @param [Elasticsearch::DSL::Search::Search] search
    # @return [void]
    def apply_highlight!(search)
      search.highlight do |hl|
        hl.fields highlight_fields
        hl.pre_tags %w[<mark>]
        hl.post_tags %w[</mark>]
      end
    end

    # @param [Elasticsearch::DSL::Search::Search] search
    # @return [void]
    def apply_indices_boost!(search)
      indices_boost = INDICES_BOOST.each_with_object({}) do |(key, boost), memo|
        index = key.respond_to?(:searchkick_index) ? key.searchkick_index.name : key
        index_by_alias = index_alias_for index

        memo[index_by_alias || index] = boost
      end

      search.indices_boost indices_boost
    end

    # @param [Elasticsearch::DSL::Search::Search] search
    # @return [void]
    def apply_pagination!(search)
      search.from offset
      search.size per_page
    end

    def apply_select!(search)
      search._source exclude: %i[text_nodes]
    end

    def has_facet?(value)
      FACET[value].in? facets
    end

    # @!attribute [r] match_option
    # @return [:phrase, nil]
    memoize def match_option
      :phrase if phrase
    end

    memoize def request_params
      slice(:search_type)
    end

    # @!attribute [r] search_indexes
    # @api private
    # @return [<Class>]
    memoize def search_indexes
      facets.map(&:constantize).presence || DEFAULT_FACETS.dup
    end

    # @!attribute [r] searchkick_options
    # @return [Hash]
    memoize def searchkick_options
      build_searchkick_options
    end

    # @!attribute [r] search_type
    # @api private
    # @return ["dfs_query_then_fetch", "query_then_fetch"]
    memoize def search_type
      has_facet?("Annotation") ? "dfs_query_then_fetch" : "query_then_fetch"
    end

    # @!attribute [r] where_conditions
    # @api private
    # @return [Hash]
    memoize def where_conditions
      { hidden: false }.tap do |where|
        where[:_id] = text_section.id if text_section
        where[:parent_text] = text.id if text
        where[:parent_project] = project.id if project
      end
    end

    # @return [Integer]
    memoize def offset
      (page_number - 1) * per_page + padding
    end

    private

    def build_searchkick_options
      slice_with(
        :debug,
        :load,
        :request_params,
        :per_page,
        page: :page_number,
        index_name: :search_indexes
      )
    end

    memoize def highlight_fields
      HIGHLIGHT_OPTIONS[:fields].deep_dup.transform_keys do |key|
        "#{key}.analyzed"
      end
    end

    # @note Try to use index explicitly instead of alias: https://github.com/elasticsearch/elasticsearch/issues/4756
    def index_alias_for(index)
      aliases = Searchkick.client.indices.get_alias(index: index)

      return nil if aliases.blank?

      return aliases.keys.first if aliases.respond_to?(:keys)
    end
  end
end
