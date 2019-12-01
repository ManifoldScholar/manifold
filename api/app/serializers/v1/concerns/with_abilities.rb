module V1
  module Concerns
    module WithAbilities
      extend ActiveSupport::Concern

      included do
        attributes :abilities do |object, params|
          abilities(object, params)
        end
      end
    end
  end
end
