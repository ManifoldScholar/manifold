# frozen_string_literal: true

FactoryBot.define do
  factory :entitlement_import do
    creator { User.cli_user }

    file { Rails.root.join("spec", "data", "sample_entitlement_import.csv").open("r+") }
  end
end
