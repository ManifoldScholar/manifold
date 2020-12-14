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

    trait :completed_project_view do
      name { "view project" }
      time { Time.current - 5.minutes }
      properties { {record.model_name.param_key => record.id, ended_at: Time.current } }
    end

  end
end
