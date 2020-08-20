module APIDocs
  module Definitions
    module Resources
      class Version
        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
