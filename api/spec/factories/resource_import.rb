FactoryBot.define do
  factory :resource_import do
    source { :attached_data }
    storage_type { "google_drive" }
    storage_identifier { "0B6UzSqdJo8o8WU40WHFTeWFPUW8" }
    header_row { 2 }
    column_map { {} }
    data { Rack::Test::UploadedFile.new(Rails.root.join('spec', 'data','resource_import','resources.csv'), 'text/csv') }
    association :creator, factory: :user
    project

    factory :resource_import_csv do
      source { :attached_data }
      header_row { 2 }
      data { Rack::Test::UploadedFile.new(Rails.root.join('spec', 'data','resource_import','resources.csv'), 'text/csv') }
      url { nil }
    end

    factory :resource_import_google do
      source { :google_sheet }
      header_row { 2 }
      data { nil }
      url { "https://docs.google.com/spreadsheets/d/1cTWJ_lZdxQKs9LJOn_PrUADfTpWD8TBpSkxfl4i-20o/edit?usp=sharing" }
    end
  end
end
