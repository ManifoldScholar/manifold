FactoryBot.define do
  factory :system_entitlement do
    to_create do |instance|
      instance.upsert!

      SystemEntitlement.find instance.id
    end

    trait :subscription do
      kind { :subscription }
    end
  end
end
