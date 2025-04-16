# frozen_string_literal: true

module Patches
  module Ahoy
    module Tracker
      def initialize(options)
        super
        @visitor_token = options[:visitor_token]
      end
    end
  end
end

Ahoy::Tracker.prepend Patches::Ahoy::Tracker
