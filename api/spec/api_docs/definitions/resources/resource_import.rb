module ApiDocs
  module Definitions
    module Resources
      class ResourceImport

        REQUIRED_CREATE_ATTRIBUTES = [:header_row].freeze

        REQUEST_ATTRIBUTES = {
            data: Types::Serializer::Upload
        }.freeze


        class << self
          include Resource
        end
      end
    end
  end
end
