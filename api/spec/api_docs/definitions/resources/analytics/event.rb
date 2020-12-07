module APIDocs
  module Definitions
    module Resources
      module Analytics
        class Event

          REQUIRED_CREATE_ATTRIBUTES = [name].freeze

          REQUEST_ATTRIBUTES = {
            properties: Types::Hash,
            name: Types::String
          }.freeze

          class << self
            include APIDocs::Definitions::Resource
          end
        end
      end
    end
  end
end
