FactoryGirl.define do
  factory :text do
    unique_identifier "12345"
    association :creator, factory: :user
  end
end
