module ApiDocs
  module Definitions
    module Resources
      class ReadingGroup

        REQUIRED_CREATE_ATTRIBUTES = [
          :name,
          :invitation_code
        ].freeze

        class << self

          include ApiDocs::Definitions::Resource

        end
      end
    end
  end
end
