# frozen_string_literal: true

FactoryBot.define do
  factory :lti_registration do
    transient do
      initial_state { :approved }
    end

    sequence(:name) { |n| "Platform #{n}" }
    sequence(:issuer) { |n| "https://platform#{n}.example.com" }
    sequence(:client_id) { |n| "client_#{n}" }
    authorization_endpoint { "#{issuer}/authorize" }
    token_endpoint { "#{issuer}/token" }
    jwks_uri { "#{issuer}/jwks" }
    token_endpoint_auth_method { "private_key_jwt" }
    grant_types { %w[implicit client_credentials] }
    scopes { [] }

    after(:create) do |registration, evaluator|
      registration.transition_to!(evaluator.initial_state) unless registration.in_state?(evaluator.initial_state)
    end

    trait :pending do
      initial_state { :pending }
    end

    trait :approved do
      initial_state { :approved }
    end

    trait :denied do
      initial_state { :denied }
    end

    trait :blocked do
      initial_state { :blocked }
    end

    trait :with_deployment do
      after(:create) do |registration|
        create(:lti_deployment, lti_registration: registration)
      end
    end
  end
end
