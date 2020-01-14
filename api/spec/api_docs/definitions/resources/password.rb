module ApiDocs
  module Definitions
    module Resources
      class Password
        class << self
          include Resource

          def serializer
            ::V1::UserSerializer
          end
        end
      end
    end
  end
end
