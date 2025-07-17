# frozen_string_literal: true

module ManifoldOAI
  module Types
    include Dry.Types

    Source = Instance(::ManifoldOAIRecordSource)
  end
end
