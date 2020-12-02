FactoryBot.define do
  factory :annotation do
    start_node { "start" }
    end_node { "end" }
    start_char { 1 }
    end_char { 1 }
    subject { "This is the selected passage." }
    body { "This is the body." }
    format { Annotation::TYPE_ANNOTATION }
    association :text_section, factory: :text_section
    association :creator, factory: :user

    trait :is_public do
      private { false }
    end

    trait :is_private do
      private { true }
    end
  end

  factory :resource_annotation, parent: :annotation do
    format { Annotation::TYPE_RESOURCE }
    association :resource, factory: :resource
  end

  factory :collection_annotation, parent: :annotation do
    format { Annotation::TYPE_COLLECTION }
    association :resource_collection, factory: :resource_collection
  end
end
