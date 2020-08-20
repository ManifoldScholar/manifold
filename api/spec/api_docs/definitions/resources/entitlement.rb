module APIDocs
  module Definitions
    module Resources
      class Entitlement

        REQUIRED_CREATE_ATTRIBUTES = [
          :target_url,
          :scoped_roles
        ]

        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
