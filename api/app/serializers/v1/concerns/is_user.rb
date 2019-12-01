module V1
  module Concerns
    module IsUser
      extend ActiveSupport::Concern

      included do
        include WithAbilities

        attributes :id,
                   :nickname,
                   :first_name,
                   :last_name,
                   :updated_at,
                   :full_name,
                   :is_current_user

        camelized_attributes :avatar_styles

        private_attributes :email,
                           :created_at,
                           :role,
                           :kind

        attribute :is_current_user do |object, params|
          next false unless authenticated?(params)

          object.id == params[:current_user].id
        end
      end
    end
  end
end
