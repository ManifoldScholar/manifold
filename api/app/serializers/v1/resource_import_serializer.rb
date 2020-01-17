module V1
  class ResourceImportSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :source, Types::String.enum("google_sheet", "attached_data")
    typed_attribute :data, Types::Hash.schema(
      original: Types::Hash.schema(
        id: Types::String.meta(
          example: "resourceimport/151747a1-ec84-492d-bf1f-7cb407881f5a/data/original-248172aeb6805275060ad0f6283afee1.csv"
        ),
        storage: Types::String.meta(example: "store"),
        metadata: Types::Hash.schema(
          size: Types::Integer,
          width: Types::Integer.optional,
          height: Types::Integer.optional,
          sha256: Types::String,
          filename: Types::String,
          mime_type: Types::String.meta(example: "application/octet-stream")
        )
      )
    ).meta(description: "Required if source is an attachment", read_only: true)
    typed_attribute :column_map, Types::Hash
    typed_attribute :column_automap, Types::Hash.meta(read_only: true)
    typed_attribute :header_row, Types::Integer
    typed_attribute :headers, Types::Hash.meta(read_only: true)
    typed_attribute :available_columns, Types::Array.of(Types::String).meta(read_only: true)
    typed_attribute :storage_type, Types::String
    typed_attribute :storage_identifier, Types::String
    typed_attribute :url, Types::Serializer::URL.optional.meta(description: "Required if source is a google sheet")
    typed_attribute :parse_error, Types::Bool.meta(read_only: true)
    typed_attribute :import_results, Types::Array.of(Types::String).meta(read_only: true) do |object|
      object.import_results.map { |r| camelize_hash(r) }
    end
    typed_attribute :data_filename, Types::String.meta(read_only: true), &:data_file_name
    typed_attribute :state, Types::String.meta(example: "pending") do |object|
      object.state_machine.current_state
    end

  end
end
