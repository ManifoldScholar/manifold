module V1
  class CollectionProjectSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :position, Types::Integer
    typed_has_one :project,
                  object_method_name: :project_summary,
                  id_method_name: :project_id,
                  serializer: ::V1::ProjectSerializer

  end
end
