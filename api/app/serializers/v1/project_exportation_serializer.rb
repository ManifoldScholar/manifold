module V1
  class ProjectExportationSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :current_state, Types::String
    typed_attribute :exported_at, Types::DateTime.meta(read_only: true)
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)

    typed_belongs_to :project
    typed_belongs_to :export_target
  end
end
