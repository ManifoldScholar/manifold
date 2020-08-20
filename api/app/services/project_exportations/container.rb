module ProjectExportations
  class Container
    include IntrospectiveContainer

    register_simple_callables_in(
      :operations,
      :ensure_can_ready_export, :export_and_attach_project,
      :mark_export_ready, :upload_project
    )

    register_simple_callables_in :pipelines, :upload
  end
end
