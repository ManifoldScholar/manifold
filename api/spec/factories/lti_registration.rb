# frozen_string_literal: true

FactoryBot.define do
  factory :lti_registration do
    sequence(:name) { |n| "Platform #{n}" }
    sequence(:issuer) { |n| "https://platform#{n}.example.com" }
    sequence(:client_id) { |n| "client_#{n}" }
    authorization_endpoint { "#{issuer}/authorize" }
    token_endpoint { "#{issuer}/token" }
    jwks_uri { "#{issuer}/jwks" }
    token_endpoint_auth_method { "private_key_jwt" }
    grant_types { %w[implicit client_credentials] }
    scopes { [] }

    trait :disabled do
      enabled { false }
    end

    trait :with_deployment do
      after(:create) do |registration|
        create(:lti_deployment, lti_registration: registration)
      end
    end
  end
end
