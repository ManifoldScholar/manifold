class ExportKind < ClassyEnum::Base
  include ActiveModel::Validations

  def epub?
    false
  end

  def known?
    !unknown?
  end

  private

  def matches_or_belongs_to?(owner, klass)
    return true if owner.is_a?(klass)

    association_name = klass.model_name.i18n_key

    owner.respond_to?(association_name) && owner.public_send(association_name).is_a?(klass)
  end

  # @return [void]
  def owner_must_be!(klass)
    return unless owner.present?

    errors.add :owner, "must be a type of #{klass}" unless matches_or_belongs_to?(owner, klass)
  end

  # @return [void]
  def owner_must_be_project_export!
    owner_must_be! ProjectExport
  end

  # @return [void]
  def owner_must_be_text_export!
    owner_must_be! TextExport
  end
end

class ExportKind::BagIt < ExportKind
  validate :owner_must_be_project_export!
end

class ExportKind::EpubV3 < ExportKind
  validate :owner_must_be_text_export!

  def epub?
    true
  end
end

class ExportKind::Unknown < ExportKind
end
