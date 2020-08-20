module APIDocs
  module Definitions
    module Resources
      class ContentBlock

        REQUIRED_CREATE_ATTRIBUTES = [
          :type
        ].freeze

        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
