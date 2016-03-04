FactoryGirl.define do
  factory :text_section do
    sequence(:position)
    kind TextSection::KIND_SECTION
    text
    resource
  end
end
