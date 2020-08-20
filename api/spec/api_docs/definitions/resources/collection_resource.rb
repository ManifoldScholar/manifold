module APIDocs
  module Definitions
    module Resources
      class CollectionResource
        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
