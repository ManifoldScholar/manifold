FactoryGirl.define do
  factory :text do
    unique_identifier "12345"
    transient do
      text_sections_count 5
    end
    after(:create) do |text, evaluator|
      create_list(:text_section, evaluator.text_sections_count, text: text)
    end
  end
end
