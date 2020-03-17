module ApiDocs
  module Definitions
    module Resources
      class ExportTarget

        REQUIRED_CREATE_ATTRIBUTES = [:name]

        class << self
          include ApiDocs::Definitions::Resource
        end
      end
    end
  end
end
