FactoryGirl.define do
  factory :annotation do
    start_node "start"
    end_node "end"
    start_char 1
    end_char 1
    subject "MyText"
    format Annotation::TYPE_ANNOTATION
    association :text_section, factory: :text_section
    association :creator, factory: :user
  end

  factory :resource_annotation, parent: :annotation do
    format Annotation::TYPE_RESOURCE
    association :resource, factory: :resource
  end
end
