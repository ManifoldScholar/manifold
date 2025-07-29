# frozen_string_literal: true

module V1
  module Concerns
    module HasOAIRecordSerializer
      extend ActiveSupport::Concern
      included do
        typed_attribute :exclude_from_oai, Types::Bool
      end
    end
  end
end
