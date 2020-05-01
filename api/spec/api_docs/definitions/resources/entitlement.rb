module ApiDocs
  module Definitions
    module Resources
      class Entitlement

        REQUIRED_CREATE_ATTRIBUTES = [
          :target_url,
          :scoped_roles
        ]

        class << self
          include ApiDocs::Definitions::Resource
        end
      end
    end
  end
end
