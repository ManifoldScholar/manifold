module ApiDocs
  module Definitions
    module Resources
      class Page

        REQUIRED_CREATE_ATTRIBUTES = [
          :title
        ].freeze

        ID_TYPE = ::Types::String.meta(example: "1")

        class << self
          include Resource
        end
      end
    end
  end
end
