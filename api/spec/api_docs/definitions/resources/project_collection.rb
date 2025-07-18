# frozen_string_literal: true

module APIDocs
  module Definitions
    module Resources
      class ProjectCollection
        REQUIRED_CREATE_ATTRIBUTES = [
          :title,
          :sort_order,
          :icon
        ].freeze

        METADATA_ATTRIBUTES = {
          exclude_from_oai: Types::Bool
        }.freeze

        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
