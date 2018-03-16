# Provides a serialization of a resource model.
class ResourceImportSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :source, :data, :state, :column_map, :column_automap, :header_row,
             :headers, :available_columns, :data_filename, :storage_type,
             :storage_identifier, :import_results, :url, :parse_error

  def data_filename
    object.data.original_filename
  end

  delegate :import_results, to: :object

  def state
    object.state_machine.current_state
  end

end
