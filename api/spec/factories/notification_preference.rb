FactoryBot.define do
  factory :notification_preference do
    kind { "replies_to_me" }
    user
  end
end
