FactoryGirl.define do
  factory :annotation do
    start_node "start"
    end_node "end"
    start_char 1
    end_char 1
    subject "MyText"
    format "annotation"
    text_section
    association :creator, factory: :user
  end
end
