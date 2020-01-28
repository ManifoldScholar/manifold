module ApiDocs
  module Definitions
    module Resources
      class Subject

        REQUIRED_CREATE_ATTRIBUTES = [:name].freeze

        class << self
          include ApiDocs::Definitions::Resource
        end
      end
    end
  end
end
