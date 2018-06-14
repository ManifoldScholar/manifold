module Ingestions
  module Converters
    class Html < Ingestions::Converters::AbstractConverter

      def perform
        contents
      end

      def self.convertible_extensions
        %w(htm html)
      end

    end
  end
end
