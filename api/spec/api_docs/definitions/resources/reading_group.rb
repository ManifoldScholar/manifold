module ApiDocs
  module Definitions
    module Resources
      class ReadingGroup

        REQUIRED_CREATE_ATTRIBUTES = [
          :name,
          :invitation_code
        ].freeze

        class << self

          include Resource

        end
      end
    end
  end
end
