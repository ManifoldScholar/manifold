module ResourceImports
  class MakeRow < ActiveInteraction::Base
    record :resource_import
    array :raw_row
    integer :line_number

    def execute
      resource_import_row =
        ResourceImportRow.new(
          line_number: line_number,
          resource_import: resource_import,
          row_type: row_type,
          values: raw_row
        )
      resource_import_row.save!
    end

    private

    def header_row_number
      resource_import.header_row
    end

    def row_type
      return ResourceImportRow::ROW_TYPE_DATA if line_number > header_row_number
      return ResourceImportRow::ROW_TYPE_HEADER if line_number == header_row_number

      ResourceImportRow::ROW_TYPE_IGNORED
    end

  end
end
