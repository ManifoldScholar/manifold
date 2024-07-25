# frozen_string_literal: true

# Shared logic for
module ProjectOrdering
  extend ActiveSupport::Concern

  ALLOWED_SORT_KEYS = %w(created_at updated_at publication_date title).freeze
  ALLOWED_SORT_DIRECTIONS = %w(asc desc).freeze

  ALLOWED_SORT_MAPPING = Filtering::SortMapping.from(*ALLOWED_SORT_KEYS)

  ALLOWED_SORT_VALUES = ALLOWED_SORT_MAPPING.keys.freeze

  DEFAULT_COLLECTION_SORT_VALUE = "created_at_desc"
end
