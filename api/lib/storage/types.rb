# frozen_string_literal: true

module Storage
  module Types
    include Dry.Types

    StrategyName = String.default("file").enum("file", "gcs", "s3").constructor do |input|
      case input
      when /\Aaws\z/i then "s3"
      when String
        input.downcase.strip
      end
    end

    StrategyType = Symbol.enum(:primary, :mirror)

    PrimaryStrategyName = StrategyName.fallback("file")

    MirrorStrategyName = StrategyName.optional.fallback(nil)
  end
end
