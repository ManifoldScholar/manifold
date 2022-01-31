FactoryBot.define do
  factory :project do
    title { "A project title" }
    avatar_color { "primary" }
    draft { false }
    association :creator, factory: :user

    trait :exports_as_bag_it do
      exports_as_bag_it { true }
    end

    trait :as_draft do
      draft { true }
    end

    trait :with_restricted_access do
      restricted_access { true }
    end
  end
end
