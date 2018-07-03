module Ingestions
  module Concerns
    module IncludesContext
      extend ActiveSupport::Concern

      included do
        object :context, class: "Ingestions::Context"

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
  end
end
