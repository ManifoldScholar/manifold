# frozen_string_literal: true

module HasKeywordSearch
  extend ActiveSupport::Concern

  include SearchIndexable

  # 0 (the default) ignores the document length
  # 1 divides the rank by 1 + the logarithm of the document length
  # 2 divides the rank by the document length
  # 4 divides the rank by the mean harmonic distance between extents
  # 8 divides the rank by the number of unique words in document
  # 16 divides the rank by 1 + the logarithm of the number of unique words in document
  # 32 divides the rank by itself + 1
  TSEARCH_NORMALIZATION = 1 | 2 | 4

  COMMON_TSEARCH_OPTIONS = {
    dictionary: "english",
    normalization: TSEARCH_NORMALIZATION,
    highlight: {
      StartSel: "<mark>",
      StopSel: "</mark>",
      MinWords: 12,
      MaxWords: 80,
      ShortWord: 4,
      HighlightAll: false,
      MaxFragments: 3,
      FragmentDelimiter: "&hellip;"
    },
    websearch: true,
  }.freeze

  module ClassMethods
    # @return [void]
    def has_keyword_search!(**options)
      normalized_options = normalize_keyword_search_options(**options)

      keyword_search_options normalized_options.freeze

      pg_search_scope :keyword_search, **normalized_options
    end

    def has_keyword_search?
      keyword_search_options.present?
    end

    private

    def normalize_keyword_search_options(**options)
      options[:ignoring] = :accents
      options[:using] ||= {}
      options[:using][:tsearch] ||= {}
      options[:using][:tsearch].reverse_merge!(COMMON_TSEARCH_OPTIONS)

      return options
    end
  end
end
