module APIDocs
  module Definitions
    module Resources
      class TwitterQuery

        REQUIRED_CREATE_ATTRIBUTES = [:query].freeze

        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
