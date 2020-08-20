module APIDocs
  module Definitions
    module Resources
      class CurrentUser
        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
