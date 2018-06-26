module Ingestions
  module Concerns
    module IncludesContext
      extend ActiveSupport::Concern

      included do
        object :context, class: "Ingestions::Context"
      end
    end
  end
end
