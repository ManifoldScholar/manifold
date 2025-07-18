# frozen_string_literal: true

module ManifoldOAI
  module Types
    include Dry.Types

    LIMIT_MIN = 10
    LIMIT_MAX = 100
    LIMIT_DEFAULT = 50

    Limit = Coercible::Integer.default(LIMIT_DEFAULT).constrained(gteq: LIMIT_MIN, lteq: LIMIT_MAX).fallback(LIMIT_DEFAULT)

    RecordSource = Instance(::ManifoldOAIRecordSource)

    ResumptionToken = Instance(::OAI::Provider::ResumptionToken)

    SetSource = Instance(::ManifoldOAISetSource)
  end
end
