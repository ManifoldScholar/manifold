FactoryBot.define do
  factory :tag do
    name { Faker::Dog.breed }
  end
end
