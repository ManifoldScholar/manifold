# frozen_string_literal: true

module APIDocs
  module Definitions
    module Resources
      class Maker
        REQUIRED_CREATE_ATTRIBUTES = [].freeze

        REQUEST_ATTRIBUTES = {
          avatar: Types::Serializer::Upload,
          remove_avatar: Types::Bool
        }.freeze

        class << self
          include APIDocs::Definitions::Resource

          def create_attributes
            request_attributes.except(:remove_avatar)
          end
        end
      end
    end
  end
end
