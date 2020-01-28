module ApiDocs
  module Definitions
    module Resources
      class TwitterQuery

        REQUIRED_CREATE_ATTRIBUTES = [:query].freeze

        class << self
          include ApiDocs::Definitions::Resource
        end
      end
    end
  end
end
