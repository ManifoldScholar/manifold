FactoryBot.define do
  factory :journal do
    title { "A journal title" }
    avatar_color { "primary" }
    draft { false }
    hero_layout { 1 }
    association :creator, factory: :user

    trait :as_draft do
      draft { true }
    end

  end
end
