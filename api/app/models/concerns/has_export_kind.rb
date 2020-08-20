module HasExportKind
  extend ActiveSupport::Concern

  included do
    classy_enum_attr :export_kind, allow_blank: false, default: :unknown

    scope :by_kind, ->(kind) { where(export_kind: kind) }

    validate :must_be_valid_export_kind!
    validate :must_be_known_export_kind!
  end

  private

  # @return [void]
  def must_be_known_export_kind!
    errors.add :export_kind, "must be a known export kind" unless export_kind.known?
  end

  # @return [void]
  def must_be_valid_export_kind!
    errors.add :export_kind, "must be a valid export kind" unless export_kind.valid?
  end
end
