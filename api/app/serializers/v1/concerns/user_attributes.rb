module V1
  module Concerns
    module UserAttributes
      extend ActiveSupport::Concern

      included do
        abilities

        typed_attribute :nickname, Types::String
        typed_attribute :first_name, Types::String
        typed_attribute :last_name, Types::String
        typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
        typed_attribute :full_name, Types::String.meta(read_only: true)
        typed_attribute :avatar_styles, Types::Serializer::Attachment.meta(read_only: true)
        typed_attribute :email, Types::Serializer::Email, private: true
        typed_attribute :created_at, Types::DateTime.meta(read_only: true), private: true
        typed_attribute :role, Types::String, private: true
        typed_attribute :kind, Types::String.meta(read_only: true), private: true
        typed_attribute :is_current_user, Types::Bool.meta(read_only: true) do |object, params|
          next false unless authenticated?(params)
          object.id == params[:current_user].id
        end
      end
    end
  end
end
