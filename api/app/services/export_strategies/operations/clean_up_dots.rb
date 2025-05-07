# frozen_string_literal: true

module ExportStrategies
  module Operations
    class CleanUpDots
      include Shared::PipelineOperation

      DOT = "."
      DOUBLE_DOT = /\.\./

      # @param [String] input
      # @return [String]
      def call(input)
        input.gsub(DOUBLE_DOT, DOT).chomp(DOT)
      end
    end
  end
end
