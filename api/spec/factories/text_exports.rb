FactoryBot.define do
  factory :text_export do
    text { nil }
    export_kind { "MyText" }
    fingerprint { "MyText" }
    asset_data { "" }
  end
end
