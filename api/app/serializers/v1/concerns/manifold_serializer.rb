module V1
  module Concerns
    module ManifoldSerializer
      extend ActiveSupport::Concern

      included do
        pluralize_type true
        manifold_meta
      end
    end
  end
end
