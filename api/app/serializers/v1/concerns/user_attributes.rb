module V1
  module Concerns
    module UserAttributes
      extend ActiveSupport::Concern

      included do
        abilities

        typed_attribute :id, NilClass
        typed_attribute :nickname, NilClass
        typed_attribute :first_name, NilClass
        typed_attribute :last_name, NilClass
        typed_attribute :updated_at, NilClass
        typed_attribute :full_name, NilClass
        typed_attribute :is_current_user, NilClass
        typed_attribute :avatar_styles, Types::Hash

        typed_attribute :email, NilClass, private: true
        typed_attribute :created_at, NilClass, private: true
        typed_attribute :role, NilClass, private: true
        typed_attribute :kind, NilClass, private: true
        typed_attribute :is_current_user, NilClass do |object, params|
          next false unless authenticated?(params)

          object.id == params[:current_user].id
        end
      end
    end
  end
end
