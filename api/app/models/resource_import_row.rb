# A resource is any asset our source document that is associated with a text.
class ResourceImportRow < ApplicationRecord

  ROW_TYPE_DATA = "data".freeze
  ROW_TYPE_IGNORED = "ignored".freeze
  ROW_TYPE_HEADER = "header".freeze

  include Statesman::Adapters::ActiveRecordQueries
  include Fingerprinted

  belongs_to :resource_import, inverse_of: :resource_import_rows
  belongs_to :resource, optional: true, inverse_of: :resource_import_row
  has_many :resource_import_row_transitions, autosave: false, dependent: :destroy

  validates :row_type,
            inclusion: { in: [ROW_TYPE_DATA, ROW_TYPE_IGNORED, ROW_TYPE_HEADER] }

  scope :with_type_ignored, -> { where(row_type: ROW_TYPE_IGNORED) }
  scope :with_type_data, -> { where(row_type: ROW_TYPE_DATA) }
  scope :with_type_header, -> { where(row_type: ROW_TYPE_HEADER) }
  scope :ordered, -> { order(:line_number) }

  delegate :column_map, to: :resource_import
  delegate :creator, to: :resource_import
  delegate :project, to: :resource_import
  delegate :storage_type, to: :resource_import
  delegate :storage_identifier, to: :resource_import
  delegate :google_drive_storage?, to: :resource_import
  delegate :resources, to: :project, prefix: true

  def state_machine
    @state_machine ||= ResourceImportRows::StateMachine.new(
      self,
      transition_class: ResourceImportRowTransition
    )
  end

  def self.transition_class
    ResourceImportRowTransition
  end

  def self.initial_state
    :pending
  end
  private_class_method :initial_state

  def value(position)
    return nil unless position

    values[position.to_i - 1]
  end

  def value_for(attribute)
    value(column_map.key(attribute))
  end

  def set_resource
    return unless row_type == ROW_TYPE_DATA

    match = project_resources.find_by fingerprint: fingerprint
    return unless match

    self.resource = match
    save!
  end

  def update?
    resource.is_a? Resource
  end

  def skip?
    value = value_for("special_instructions")
    return false if value.blank?

    value.split(";").map(&:strip).include?("skip")
  end

  def mapped_result
    {
      resource_id: resource_id,
      resource_kind: resource&.kind,
      resource_title: resource&.title,
      line_number: line_number,
      state: state_machine.current_state,
      errors: import_errors,
      is_update: update?,
      is_skip: skip?,
      id: id
    }
  end

  def fingerprint
    value_for("fingerprint") || generate_fingerprint(fingerprint_candidates)
  end

  def fingerprint_candidates
    candidates = %w(external_url).map { |c| value_for(c) }
    candidates << %w(external_type external_id).map { |c| value_for(c) }.join
    candidates << %w(title attachment.attachment).map { |c| value_for(c) }.join
    candidates
  end

end
