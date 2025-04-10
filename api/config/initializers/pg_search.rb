# 0 (the default) ignores the document length
# 1 divides the rank by 1 + the logarithm of the document length
# 2 divides the rank by the document length
# 4 divides the rank by the mean harmonic distance between extents
# 8 divides the rank by the number of unique words in document
# 16 divides the rank by 1 + the logarithm of the number of unique words in document
# 32 divides the rank by itself + 1

T_SEARCH_NORMALIZATION = 1 + 2 + 4

PgSearch.multisearch_options = {
  using: {
    tsearch: {
      normalization: T_SEARCH_NORMALIZATION,
      prefix: true,
      highlight: {
        StartSel: "<mark>",
        StopSel: "</mark>",
        MinWords: 12,
        MaxWords: 80,
        ShortWord: 4,
        HighlightAll: true,
        MaxFragments: 3,
        FragmentDelimiter: "&hellip;"
      }
    }
  },
  ignoring: :accents
}
