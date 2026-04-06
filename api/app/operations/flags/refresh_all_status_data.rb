# frozen_string_literal: true

module Flags
  # @see Flag
  # @see FlagStatus
  # @see FlaggableResource
  # @see Flags::RefreshAllStatusDataJob
  # @see Flags::RefreshStatusData
  class RefreshAllStatusData
    include Dry::Monads[:result, :do]
    include ManifoldApi::Deps[
      refresh_status_data: "flags.refresh_status_data"
    ]

    FLAGGABLE = {
      annotations: ::Annotation,
      comments: ::Comment,
    }.freeze

    # @return [{ Symbol => Integer }]
    def call
      refreshed = FLAGGABLE.transform_values do |flaggable_klass|
        yield refresh_status_data.(flaggable_klass)
      end

      Success refreshed
    end
  end
end
