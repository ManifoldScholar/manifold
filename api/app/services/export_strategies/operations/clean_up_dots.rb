module ExportStrategies
  module Operations
    class CleanUpDots
      include Shared::PipelineOperation

      DOT = ".".freeze
      DOUBLE_DOT = /\.\./.freeze

      # @param [String] input
      # @return [String]
      def call(input)
        input.gsub(DOUBLE_DOT, DOT).chomp(DOT)
      end
    end
  end
end
