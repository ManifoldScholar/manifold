# frozen_string_literal: true

FactoryBot.define do
  factory :text_track do
    label { "English" }
    srclang { "en" }
    kind { TextTrackKind::Captions }
    cues { Rails.root.join("spec", "data", "assets", "vtt", "captions.vtt").open }
  end
end
