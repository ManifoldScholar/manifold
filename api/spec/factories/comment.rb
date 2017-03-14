FactoryGirl.define do
  factory :comment do
    body "This is the body"
    flags 0
    association :creator, factory: :user
    association :subject, factory: :annotation
  end
end
