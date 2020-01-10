module ApiDocs
  module Definitions
    module Resources
      class Subject

        REQUIRED_CREATE_ATTRIBUTES = [:name].freeze

        class << self
          include Resource
        end
      end
    end
  end
end
