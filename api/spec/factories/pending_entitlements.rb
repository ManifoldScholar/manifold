# frozen_string_literal: true

FactoryBot.define do
  factory :pending_entitlement do
    association :subject, factory: :project

    expiration { "in 1 year" }
    email { Faker::Internet.unique.email }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }

    trait :successful do
      user do
        FactoryBot.create(:user, email: email, first_name: first_name, last_name: last_name)
      end

      entitlement do
        FactoryBot.create(:entitlement, :read_access, target: user, subject: subject)
      end

      after(:create) do |pe|
        pe.transition_to! :success unless pe.in_state?(:success)
      end
    end
  end
end
