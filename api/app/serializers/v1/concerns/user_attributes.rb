module V1
  module Concerns
    module UserAttributes
      extend ActiveSupport::Concern

      CURRENT_CAN_UPDATE = ->(object, params) do
        next false unless params[:current_user].present?

        params[:current_user].can_update?(object)
      end

      included do
        abilities

        typed_attribute :consent_manifold_analytics, Types::Bool.optional
        typed_attribute :consent_google_analytics, Types::Bool.optional
        typed_attribute :terms_and_conditions_accepted_at, Types::DateTime.optional

        typed_attribute :consent_complete, Types::Bool.meta(read_only: true) do |object|
          object.consent_complete?
        end

        typed_attribute :consent_needed_terms_and_conditions, Types::Bool.meta(read_only: true) do |object|
          object.consent_needed_terms_and_conditions?
        end

        typed_attribute :consent_needed_manifold_analytics, Types::Bool.meta(read_only: true) do |object|
          object.consent_needed_manifold_analytics?
        end

        typed_attribute :consent_needed_google_analytics, Types::Bool.meta(read_only: true) do |object|
          object.consent_needed_google_analytics?
        end

        typed_attribute :admin_verified, Types::Bool.meta(private: true)
        typed_attribute :email_confirmation_sent_at, Types::DateTime.optional.meta(read_only: true), private: true
        typed_attribute :email_confirmed_at, Types::DateTime.optional.meta(read_only: true), private: true
        typed_attribute :email_confirmed, Types::Bool.meta(read_only: true)
        typed_attribute :established, Types::Bool.meta(read_only: true)
        typed_attribute :trusted, Types::Bool.meta(read_only: true)

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

        link :request_email_confirmation, if: CURRENT_CAN_UPDATE do |object|
          routes.api_v1_email_confirmation_path(object.id)
        end
      end
    end
  end
end
