module ApiDocs
  module Definitions
    module Resources
      class Collaborator

        REQUIRED_CREATE_ATTRIBUTES = [:role].freeze

        class << self
          include Resource
        end
      end
    end
  end
end
