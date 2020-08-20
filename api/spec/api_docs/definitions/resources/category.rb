module APIDocs
  module Definitions
    module Resources
      class Category
        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
