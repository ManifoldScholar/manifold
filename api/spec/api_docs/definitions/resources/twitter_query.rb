module ApiDocs
  module Definitions
    module Resources
      class TwitterQuery

        REQUIRED_CREATE_ATTRIBUTES = [:query].freeze

        class << self
          include Resource
        end
      end
    end
  end
end
