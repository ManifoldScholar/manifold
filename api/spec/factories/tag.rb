FactoryBot.define do
  factory :tag do
    name { Faker::Creature::Dog.breed }
  end
end
