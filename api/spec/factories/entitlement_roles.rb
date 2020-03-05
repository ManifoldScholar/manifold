FactoryBot.define do
  factory :entitlement_role do
    name { :unknown }

    to_create do |instance|
      instance.upsert!.reload
    end

    trait :read_access do
      name { :read_access }
    end

    trait :subscriber do
      name { :subscriber }
    end
  end
end
