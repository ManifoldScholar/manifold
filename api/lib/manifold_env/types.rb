# frozen_string_literal: true

module ManifoldEnv
  module Types
    include Dry.Types

    THROTTLED_CATEGORIES = %i[
      comment_creation
      public_annotation_creation
      public_reading_group_creation
      registration
    ].freeze

    ThrottledCategory = Symbol.enum(:none, *THROTTLED_CATEGORIES)
    ThrottledCategoryActual = Symbol.enum(*THROTTLED_CATEGORIES)

    ThrottleOptions = Hash.schema(
      limit: Integer.constrained(gt: 0),
      period: Integer.constrained(gt: 0)
    )

    ThrottleMapping = Hash.map(ThrottledCategoryActual, ThrottleOptions)
  end
end
