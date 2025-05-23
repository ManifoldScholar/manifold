# frozen_string_literal: true

module APIDocs
  module Definitions
    module Resources
      class ActionCallout
        REQUIRED_CREATE_ATTRIBUTES = [
          :title,
          :kind,
          :location
        ].freeze

        REQUEST_ATTRIBUTES = {
          # TODO: Make sure attachment works
          # tested uploading an image and it did not work
          attachment: Types::Serializer::Upload,
          remove_attachment: Types::Bool
        }.freeze

        class << self
          include APIDocs::Definitions::Resource

          def create_attributes
            request_attributes.except(:remove_attachment)
          end
        end
      end
    end
  end
end
