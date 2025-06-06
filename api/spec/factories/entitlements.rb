# frozen_string_literal: true

FactoryBot.define do
  factory :entitlement do
    transient do
      user { FactoryBot.create :user }
    end

    target { user }

    association :entitler

    trait :global_subscriber do
      association :subject, :subscription, factory: :system_entitlement

      global_roles { { subscriber: true } }
    end

    trait :read_access do
      scoped_roles { { read_access: true } }
    end

    trait :collection_read_access do
      association :subject, factory: :project_collection

      read_access
    end

    trait :project_read_access do
      association :subject, factory: :project

      read_access
    end

    trait :for_user do
      target { user }
    end

    trait :for_reading_group do
      target { FactoryBot.create :reading_group, with_user: user }
    end

    trait :with_expiration do
      expires_on { 1.year.from_now }
    end
  end
end
