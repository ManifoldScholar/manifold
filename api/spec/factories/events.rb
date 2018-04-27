FactoryBot.define do
  factory :event do
    event_type EventType[:project_created]
    event_url "MyString"
    subject_title "MyString"
    subject_subtitle "MyString"
    attribution_name "MyString"
    attribution_url "MyString"
    attribution_identifier "MyString"
    excerpt "MyText"
    project
    association :subject, factory: :project
    event_title "MyString"
  end
end
