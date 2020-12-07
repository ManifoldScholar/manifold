module Patches
  module Ahoy
    module Tracker

      def initialize(options)
        super(options)
        @visitor_token = options[:visitor_token]
      end

    end
  end
end

Ahoy::Tracker.prepend Patches::Ahoy::Tracker
