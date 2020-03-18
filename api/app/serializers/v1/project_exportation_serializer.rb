module V1
  class ProjectExportationSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :current_state, Types::String
      .enum("new", "pending", "queued", "importing", "imported", "failed", "skipped")
      .meta(read_only: true)
    typed_attribute :exported_at, Types::DateTime.meta(read_only: true).optional
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :metadata, Types::Hash.meta(read_only: true).optional
    typed_attribute :package_url, Types::String.meta(read_only: true).optional
    typed_attribute :package_size, Types::String.meta(read_only: true).optional

    typed_belongs_to :project
    typed_belongs_to :export_target
  end
end
