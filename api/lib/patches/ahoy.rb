# frozen_string_literal: true

module Patches
  module Ahoy
    module Tracker
      def initialize(visitor_token: nil, **)
        super
        @visitor_token = visitor_token
      end
    end
  end
end

Ahoy::Tracker.prepend Patches::Ahoy::Tracker
