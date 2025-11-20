FactoryBot.define do
  factory :user_group do
    sequence(:name) { |n| "User Group #{n}" }
  end
end
