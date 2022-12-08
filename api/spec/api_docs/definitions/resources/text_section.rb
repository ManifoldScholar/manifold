module APIDocs
  module Definitions
    module Resources
      class TextSection
        
        REQUIRED_CREATE_ATTRIBUTES = [:name].freeze

        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
