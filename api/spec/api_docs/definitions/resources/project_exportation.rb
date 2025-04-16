# frozen_string_literal: true

module APIDocs
  module Definitions
    module Resources
      class ProjectExportation
        REQUIRED_CREATE_ATTRIBUTES = [
          :project_id,
          :export_target_id
        ].freeze

        REQUEST_ATTRIBUTES = {
          project_id: Types::Serializer::ID,
          project_exportation_id: Types::Serializer::ID
        }.freeze

        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
