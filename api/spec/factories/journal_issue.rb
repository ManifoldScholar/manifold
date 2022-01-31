FactoryBot.define do
  factory :journal_issue do
    number { 1 }
    subtitle { "Foo bar" }
    association :journal, factory: :journal
    association :project, factory: :project
    association :creator, factory: :user

    trait :with_volume do
      association :journal_volume, factory: :journal_volume
    end

  end
end
