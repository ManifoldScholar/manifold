FactoryBot.define do
  factory :user do
    first_name "John"
    last_name "Rambo"
    sequence(:email) { |n| "john#{SecureRandom.uuid}-@rambo.com" }
    password "bananarambo"
    password_confirmation "bananarambo"
  end
end
