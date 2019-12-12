module ApiDocs
  module Definitions
    module Resources
      class Comment

        WRITEABLE = [
          :parent_id,
          :deleted,
          :body
        ].freeze

        REQUIRED_CREATE_ATTRIBUTES = [:body].freeze

        class << self

          include Resource

          def create_attributes
            request_attributes.except(:deleted)
          end

        end
      end
    end
  end
end
