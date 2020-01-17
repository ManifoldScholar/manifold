module ApiDocs
  module Definitions
    module Resources
      class ResourceImport

        REQUIRED_CREATE_ATTRIBUTES = [:header_row].freeze

        class << self
          include Resource
        end
      end
    end
  end
end
