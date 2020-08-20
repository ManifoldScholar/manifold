module APIDocs
  module Definitions
    module Resources
      class Feature

        REQUEST_ATTRIBUTES = {
          background: Types::Serializer::Upload,
          foreground: Types::Serializer::Upload,
          remove_background: Types::Bool,
          remove_foreground: Types::Bool
        }.freeze

        class << self
          include APIDocs::Definitions::Resource

          def create_attributes
            request_attributes.except(:remove_background, :remove_foreground)
          end
        end
      end
    end
  end
end
