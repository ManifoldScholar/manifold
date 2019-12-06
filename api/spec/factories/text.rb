FactoryBot.define do
  factory :text do
    association :creator, factory: :user
    project

    trait :exports_as_epub_v3 do
      exports_as_epub_v3 { true }
    end
  end
end
