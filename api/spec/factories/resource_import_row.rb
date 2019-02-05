FactoryBot.define do
  factory :resource_import_row do
    sequence(:line_number)
    row_type { ResourceImportRow::ROW_TYPE_DATA }
    values { [] }
    resource_import

    factory :resource_import_header_row do
      values { %w(a b c) }
      row_type { ResourceImportRow::ROW_TYPE_HEADER }
    end

  end
end
