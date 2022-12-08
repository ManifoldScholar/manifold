FactoryBot.define do
  factory :text do
    association :creator, factory: :user
    project

    title { "title" }
    subtitle { nil }

    trait :exports_as_epub_v3 do
      exports_as_epub_v3 { true }
    end
  end
end
