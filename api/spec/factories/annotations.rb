FactoryGirl.define do
  factory :annotation do
    start_node ""
    end_node ""
    start_char 1
    end_char 1
    subject "MyText"
    text_section
    association :creator, factory: :user
  end
end
