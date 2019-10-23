module ApiDocs
  module Definitions
    module Resources
      class Comment

        READ_ONLY = [
          :abilities,
          :created_at,
          :flags_count,
          :children_count,
          :author_created
        ].freeze

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
