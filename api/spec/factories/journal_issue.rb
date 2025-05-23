FactoryBot.define do
  factory :journal_issue do
    number { 1 }
    association :journal, factory: :journal
    association :project, factory: :project
    association :creator, factory: :user

    trait :with_volume do
      association :journal_volume, factory: :journal_volume
    end
  end

  factory :draft_journal_issue, parent: :journal_issue do
    association :project, factory: :draft_project
  end
end
