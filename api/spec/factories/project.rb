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

    trait :with_metadata do
      metadata do
        {
          series_title: Faker::Lorem.word,
          container_title: Faker::Lorem.word,
          isbn: Faker::Internet.uuid,
          issn: Faker::Internet.uuid,
          doi: Faker::Lorem.word,
          original_publisher: Faker::Name.name,
          original_publisher_place: Faker::Address.city,
          original_title: Faker::Lorem.word,
          publisher: Faker::Name.name,
          publisher_place: Faker::Address.city,
          version: Faker::Internet.uuid,
          series_number: Faker::Internet.uuid,
          edition: Faker::Number.number,
          issue: Faker::Number.number,
          volume: Faker::Number.number,
          rights: Faker::Lorem.sentence,
          rights_territory: Faker::Address.city,
          restrictions: Faker::Lorem.word,
          rights_holder: Faker::Name.name,
          resources_doi: Faker::Lorem.word,
          citation_override: Faker::Boolean.boolean,
        }
      end
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
