FactoryBot.define do
  factory :event do
    event_type { EventType[:project_created] }
    event_url { Faker::Internet.url }
    subject_title { "MyString" }
    subject_subtitle { "MyString" }
    attribution_name { "MyString" }
    attribution_url { "MyString" }
    attribution_identifier { "MyString" }
    excerpt { "MyText" }
    project
    association :subject, factory: :project
    event_title { "MyString" }

    trait :project_created do
      event_type { :project_created }
    end

    trait :resource_added do
      event_type { :resource_added }

      subject { create(:resource, project: project) }
    end

    trait :text_added do
      event_type { :text_added }

      subject { create(:text, project: project) }
    end

    trait :text_annotated do
      event_type { :text_annotated }

      association :subject, factory: :annotation
    end

    trait :tweet do
      event_type { :tweet }
    end

    trait :comment_created do
      event_type { :comment_created }

      association :subject, factory: :comment
    end

    trait :resource_collection_added do
      event_type { :resource_collection_added }

      subject { create(:resource_collection, project: project) }
    end
  end
end
