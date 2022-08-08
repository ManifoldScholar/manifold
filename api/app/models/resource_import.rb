# A resource is any asset our source document that is associated with a text.
class ResourceImport < ApplicationRecord

  include Statesman::Adapters::ActiveRecordQueries
  include TrackedCreator
  include Attachments

  # Authorization
  include Authority::Abilities
  include SerializedAbilitiesFor
  self.authorizer_name = "ProjectRestrictedChildAuthorizer"

  belongs_to :project, inverse_of: :resource_imports
  has_many :resource_import_rows, inverse_of: :resource_import, dependent: :destroy
  has_many :resource_import_transitions, autosave: false, dependent: :destroy
  has_many :resources, through: :resource_import_rows

  validates :source, inclusion: { in: %w(google_sheet attached_data) }
  validates :storage_type, inclusion: { in: ["google_drive", nil] }
  validates :header_row, presence: true
  validates :url, presence: true, if: :google_sheet?
  validates :data, presence: true, if: :attached_data?

  manifold_has_attached_file :data, :csv, backgrounding: false

  def state_machine
    @state_machine ||= ResourceImports::StateMachine.new(
      self,
      transition_class: ResourceImportTransition
    )
  end

  def self.transition_class
    ResourceImportTransition
  end

  def self.initial_state
    :pending
  end
  private_class_method :initial_state

  def self.attachment_columns
    %w(attachment high_res variant_thumbnail variant_poster variant_format_one
       variant_format_two)
  end

  def self.metadata_columns
    Resource.metadata_properties
  end

  def self.attribute_columns
    %w(
      title kind sub_kind caption description fingerprint external_url pending_sort_title
      external_id external_type allow_download slug minimum_width minimum_height tag_list
      resource_collections
    )
  end

  def self.non_model_attributes
    %w(special_instructions)
  end

  def self.available_columns
    metadata_columns = ResourceImport.metadata_columns.map { |m| "metadata.#{m}" }
    attachment_columns = ResourceImport.attachment_columns.map { |c| "attachment.#{c}" }

    attribute_columns +
      metadata_columns +
      attachment_columns +
      non_model_attributes
  end

  def available_columns
    ResourceImport.available_columns
  end

  def headers
    values = resource_import_rows&.with_type_header&.first&.values || []
    out = {}
    values.each.with_index do |v, i|
      out[(i + 1).to_s] = v
    end
    out
  end

  def column_automap_with_headers
    column_automap.transform_keys { |key| headers[key] }
  end

  def google_sheet?
    source == "google_sheet"
  end

  def attached_data?
    source == "attached_data"
  end

  def google_drive_storage?
    storage_type == "google_drive" && !storage_identifier.blank?
  end

  def import_errors_count
    import_errors.size
  end

  def title_mapped?
    column_automap.value?("title")
  end

  def import_errors?
    import_errors_count.positive?
  end

  def import_errors
    data_rows
      .pluck(:line_number, :import_errors)
      .reject { |r| r[1].blank? }
      .to_h
  end

  def data_rows
    resource_import_rows.with_type_data.order(:line_number)
  end

  def import_results
    data_rows
      .eager_load(:resource_import_row_transitions, :resource)
      .map(&:mapped_result)
  end

  def reset
    resource_import_rows.destroy_all
    self.column_automap = {}
    self.column_map = {}
    save
  end

end
