module ExportStrategies
  # @api private
  class Container
    include IntrospectiveContainer

    register_simple_callables_in(
      :operations,
      :apply_format, :build_upload_payload, :build_upload_state, :clean_up_dots,
      :connect_and_upload, :prepare_formatter, :sanitize, :set_target_name
    )

    register_simple_callables_in :pipelines, :format_target_name, :upload
  end
end
