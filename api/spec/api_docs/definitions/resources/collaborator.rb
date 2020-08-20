module APIDocs
  module Definitions
    module Resources
      class Collaborator

        REQUIRED_CREATE_ATTRIBUTES = [:role].freeze

        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
