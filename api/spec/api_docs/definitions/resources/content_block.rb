module ApiDocs
  module Definitions
    module Resources
      class ContentBlock

        REQUIRED_CREATE_ATTRIBUTES = [
          :type
        ].freeze

        class << self
          include Resource
        end
      end
    end
  end
end
