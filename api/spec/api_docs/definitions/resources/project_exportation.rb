module APIDocs
  module Definitions
    module Resources
      class ProjectExportation

        REQUIRED_CREATE_ATTRIBUTES = [
          :project_id,
          :export_target_id
        ]

        REQUEST_ATTRIBUTES = {
          project_id: Types::Serializer::ID,
          project_exportation_id: Types::Serializer::ID
        }

        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
