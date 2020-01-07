module V1
  class ExportTargetSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :strategy, Types::String
    typed_attribute :name, Types::String
    typed_attribute :slug, Types::String
    typed_attribute :configuration, Types::Hash do |object, _params|
      object.configuration.as_filtered_json
    end

    typed_attribute :created_at, Types::String
    typed_attribute :updated_at, Types::String
  end
end
