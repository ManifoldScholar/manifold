FactoryGirl.define do
  factory :event do
    event_type Event::PROJECT_CREATED
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
