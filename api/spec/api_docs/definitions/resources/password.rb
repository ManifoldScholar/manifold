module ApiDocs
  module Definitions
    module Resources
      class Password
        class << self
          include ApiDocs::Definitions::Resource

          def serializer
            ::V1::UserSerializer
          end
        end
      end
    end
  end
end
