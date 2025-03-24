module HasKeywordSearch
  extend ActiveSupport::Concern
  include PgSearch::Model

  included do
    extend Dry::Core::ClassAttributes

    defines :keyword_search_options, type: ::Types::Hash.map(::Types::Symbol, ::Types::Any)
    defines :multisearch_options, type: ::Types::Hash.map(::Types::Symbol, ::Types::Any)

    keyword_search_options({}.freeze)
    multisearch_options({}.freeze)
  end

  module ClassMethods
    # @return [void]
    # rubocop:disable Naming/PredicateName
    def has_keyword_search!(**options)
      keyword_search_options options.freeze

      pg_search_scope :keyword_search, **options
    end

    def has_multisearch!(**options)
      multisearch_options options.freeze

      multisearchable(**options)
    end
    # rubocop:enable Naming/PredicateName

    def has_keyword_search?
      keyword_search_options.present?
    end
  end
end
