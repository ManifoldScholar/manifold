module APIDocs
  module Definitions
    module Resources
      class TextSection

        METADATA_ATTRIBUTES = {
          citation_override: Types::String
        }.freeze

        REQUIRED_CREATE_ATTRIBUTES = [:name].freeze

        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
