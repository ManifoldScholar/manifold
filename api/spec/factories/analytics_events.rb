FactoryBot.define do
  factory :analytics_event, class: Analytics::Event do
    transient do
      record { FactoryBot.create :project }
    end

    association :visit, factory: :analytics_visits
    name { Faker::Lorem.phrase }
    properties { {record.model_name.param_key => record.id} }
    time { Time.current }

    trait :view do
      name { "view #{record.model_name.param_key}" }
    end

  end
end
