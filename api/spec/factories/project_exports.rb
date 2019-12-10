FactoryBot.define do
  factory :project_export do
    association :project
    export_kind { :unknown }
    fingerprint { SecureRandom.uuid }

    trait :bag_it do
      export_kind { :bag_it }
    end
  end
end
