module V1
  class ResourceImportSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :source, NilClass
    typed_attribute :data, NilClass
    typed_attribute :column_map, NilClass
    typed_attribute :column_automap, NilClass
    typed_attribute :header_row, NilClass
    typed_attribute :headers, NilClass
    typed_attribute :available_columns, NilClass
    typed_attribute :data_filename, NilClass
    typed_attribute :storage_type, NilClass
    typed_attribute :storage_identifier, NilClass
    typed_attribute :url, NilClass
    typed_attribute :parse_error, NilClass
    typed_attribute :import_results, NilClass do |object|
      object.import_results.map { |r| camelize_hash(r) }
    end
    typed_attribute :data_filename, NilClass, &:data_file_name
    typed_attribute :state, NilClass do |object|
      object.state_machine.current_state
    end

  end
end
