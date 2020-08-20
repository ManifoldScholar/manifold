module APIDocs
  module Definitions
    module Resources
      class Annotation

        REQUIRED_CREATE_ATTRIBUTES = [
          :start_node,
          :end_node,
          :start_char,
          :end_char,
          :format,
          :subject,
          :body
        ]

        REQUEST_ATTRIBUTES = {
          section_id: Types::Serializer::ID
        }

        class << self

          include APIDocs::Definitions::Resource

        end
      end
    end
  end
end
