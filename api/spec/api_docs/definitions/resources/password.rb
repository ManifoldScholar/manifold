module APIDocs
  module Definitions
    module Resources
      class Password
        class << self
          include APIDocs::Definitions::Resource

          def serializer
            ::V1::UserSerializer
          end
        end
      end
    end
  end
end
