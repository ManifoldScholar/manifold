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

  factory :journal_issue_with_title, parent: :journal_issue do
    transient do
      journal_attributes {{title: "new"}}
      journal_volume_attributes {{number: 1}}
      project_attributes {{description: "tomorrow"}}
    end
    journal { association :journal, **journal_attributes }
    project { association :project, **project_attributes }
    association :creator, factory: :user
    journal_volume { association :journal_volume, **journal_volume_attributes }
  end
end
