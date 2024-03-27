# frozen_string_literal: true

module ManifoldEnv
  module DefinesRateLimits
    extend ActiveSupport::Concern

    included do
      extend Dry::Core::ClassAttributes

      defines :throttle_mapping, type: ManifoldEnv::Types::ThrottleMapping

      throttle_mapping({}.freeze)
    end

    module ClassMethods
      def map_throttle!(category, limit:, period:)
        new_mapping = throttle_mapping.merge(category => { limit: limit, period: period, }.freeze).freeze

        throttle_mapping new_mapping
      end
    end
  end
end
