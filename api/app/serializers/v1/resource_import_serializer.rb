module V1
  class ResourceImportSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    attributes :source,
               :data,
               :column_map,
               :column_automap,
               :header_row,
               :headers,
               :available_columns,
               :data_filename,
               :storage_type,
               :storage_identifier,
               :url,
               :parse_error

    attributes :import_results do |object|
      object.import_results.map { |r| camelize_hash(r) }
    end

    attributes :data_filename, &:data_file_name

    attributes :state do |object|
      object.state_machine.current_state
    end

  end
end
