module Ingestions
  module Converters
    class Html < Ingestions::Converters::AbstractConverter

      def perform
        contents
      end

      private

      def determine_convertibility
        %w(htm html).include? File.extname(source_path).delete(".")
      end

    end
  end
end
