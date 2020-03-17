module V1
  class ExportTargetSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    CONFIGURATION_HASH = Types::Hash.schema(
      sftpKey: Types::Hash.schema(
        port: Types::Serializer::Port,
        host: Types::Serializer::Host,
        username: Types::String,
        compression: Types::Integer,
        privateKey: Types::String.meta(
          description: "The key used to secure the sftp connection. This value "\
          "can be updated, but will not be sent in any response. It will instead "\
          "respond with [FILTERED] if there is a value.",
          example: "[FILTERED]"
        )
      ).optional,
      sftpPassword: Types::Hash.schema(
        port: Types::Serializer::Port,
        host: Types::Serializer::Host,
        username: Types::String,
        password: Types::String
      ).optional,
      targetNameFormat: Types::String.meta(example: "%s-%t.%e"),
      strategy: Types::Integer.meta(
        description: "A numeric representation of the export target strategy",
        read_only: true
      )
    )

    typed_attribute :strategy, Types::String.meta(
      description: "Denotes which of the two sftp configurations will be used",
      example: "sftp_key"
    )
    typed_attribute :name, Types::String
    typed_attribute :slug, Types::String.meta(read_only: true)
    typed_attribute :configuration, CONFIGURATION_HASH do |object, params|
      next nil unless current_user_can_update?(object, params)

      object.configuration.as_filtered_json
    end

    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
  end
end
