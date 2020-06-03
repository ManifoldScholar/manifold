FactoryBot.define do
  factory :project_collection do
    title { Faker::Lorem.unique.sentence }
    sort_order { "title_asc" }
    visible { true }
    homepage { false }
    smart { false }
    icon { "lamp" }
    association :creator, factory: :user

    trait :smart do
      smart { true }
    end
  end
end
