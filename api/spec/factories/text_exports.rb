FactoryBot.define do
  factory :text_export do
    association :text
    export_kind { :unknown }
    fingerprint { SecureRandom.uuid }

    trait :epub_v3 do
      export_kind { :epub_v3 }
    end
  end
end
