module V1
  module Concerns
    module WithCreator
      extend ActiveSupport::Concern

      included do
        belongs_to :creator, serializer: ::V1::UserSerializer, record_type: :users
      end
    end
  end
end
