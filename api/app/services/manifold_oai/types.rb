# frozen_string_literal: true

module ManifoldOAI
  module Types
    include Dry.Types

    # extend Support::EnhancedTypes

    Source = Instance(::ManifoldOAIRecordSource)
  end
end
