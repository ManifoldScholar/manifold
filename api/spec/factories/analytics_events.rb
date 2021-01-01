FactoryBot.define do
  factory :analytics_event, class: Analytics::Event do
    transient do
      record { FactoryBot.create :project }
    end

    association :visit, factory: :analytics_visit
    name { Faker::Lorem.phrase }
    properties { {record.model_name.param_key => record.id} }
    time { Time.current }

    trait :view do
      name { "view #{record.model_name.param_key}" }
    end

    trait :completed_project_view do
      name { "view project" }
      time { Time.current - 5.minutes }
      properties { {record.model_name.param_key => record.id, ended_at: time + 5.minutes } }
    end

    trait :completed_text_view do
      name { "view text" }
      time { Time.current - 5.minutes }
      properties { {record.model_name.param_key => record.id, ended_at: time + 5.minutes } }
    end

    trait :completed_text_section_view do
      name { "view text_section" }
      time { Time.current - 5.minutes }
      properties { {record.model_name.param_key => record.id, ended_at: time + 5.minutes } }
    end

  end

  factory :analytics_event_request, class: Analytics::Event do
    transient do
      subject { FactoryBot.create(:project) }
    end

    name { Faker::Lorem.word }
    properties { { Faker::Lorem.word => Faker::Lorem.word } }
    # properties { {subject_type: subject.class.name, subject_id: subject.id} }
    # subject_type { subject.class.name }
    # subject_id { subject.id }
  end
end
