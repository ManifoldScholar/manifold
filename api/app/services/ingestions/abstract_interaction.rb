module Ingestions
  class AbstractInteraction < AbstractBaseInteraction

    object :context, class: "Ingestions::Context"

    delegate :ingestion, to: :context

    delegate :significant, to: :context
    delegate :info, to: :context
    delegate :debug_string, to: :context
    delegate :debug, to: :context
    delegate :error, to: :context
    delegate :error_string, to: :context
    delegate :warn, to: :context
    delegate :log_structure, to: :context

  end
end
