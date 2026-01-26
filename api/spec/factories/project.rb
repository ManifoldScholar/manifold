# frozen_string_literal: true

FactoryBot.define do
  factory :project do
    transient do
      journal { nil }
    end

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

    trait :with_cover do
      cover do
        Rails.root.join("spec", "data", "assets", "images", "publication_resource.png").open("rb+")
      end
    end

    after :create do |project, evaluator|
      if evaluator.journal.present?
        FactoryBot.create(:journal_issue, journal: evaluator.journal, project:)

        project.reload
      end
    end
  end

  factory :draft_project, parent: :project do
    draft { true }
  end
end
