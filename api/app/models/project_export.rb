class ProjectExport < ApplicationRecord
  include ArchiveUploader::Attachment.new(:asset)
  include HasExportKind

  belongs_to :project, inverse_of: :project_exports
  has_many :project_export_statuses, inverse_of: :project_export

  upsert_keys %i[project_id export_kind fingerprint]

  scope :by_project, ->(project) { where(project: project) }
  scope :by_fingerprint, ->(fingerprint) { where(fingerprint: fingerprint) }
  scope :bag_it, -> { by_kind :bag_it }
  scope :prunable, -> { where(id: ProjectExportStatus.prunable_export_ids) }

  jsonb_accessor :metadata, files: [:indifferent_hash, { array: true, default: [] }]

  delegate :extension, to: :asset, prefix: true
  delegate :id, :title, :slug, to: :project, prefix: true

  before_validation :populate_files!

  validates :fingerprint, uniqueness: { scope: %i[project_id export_kind] }

  # @api private
  # @note Used by {ArchiveUploader}
  # @return [(String, String)]
  def location_identifier
    raise "Cannot derive pretty location" unless project_id? && fingerprint?

    [project_id, fingerprint]
  end

  # @api private
  # @return [void]
  def populate_files!
    self.files = asset_files if files.blank?
  end

  # @api private
  # @return [void]
  def refresh_files!
    self.files = asset_files fresh: true

    save!
  end

  # @return [ExportStrategies::TargetNameFormatter]
  def to_target_name_formatter
    ExportStrategies::TargetNameFormatter.new to_target_name_formatter_options
  end

  # @return [{ Symbol => Object }]
  def to_target_name_formatter_options
    slice_with(
      :project_id, :project_slug,
      export_asset_extension: :asset_extension,
      export_id: :id,
      project_name: :project_title
    )
  end

  class << self
    # @raise [TypeError] if provided an invalid type
    # @return [ProjectExport]
    def find_or_initialize_for_bag_it(projectish)
      query = bag_it

      case projectish
      when Packaging::BagItSpec::Context
        return find_or_initialize_for_bag_it(projectish.project)
      when Project
        fingerprint = Projects::CalculateFingerprint.run! project: projectish

        query = query.by_project(projectish).by_fingerprint(fingerprint)
      else
        raise TypeError, "Cannot #{__method__}(#{projectish.inspect})"
      end

      query.first_or_initialize
    end
  end
end
