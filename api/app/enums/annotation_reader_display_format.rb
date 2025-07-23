# frozen_string_literal: true

class AnnotationReaderDisplayFormat < ClassyEnum::Base
  include ActiveModel::Validations

  NOTATION_TYPES = %w(resource resource_collection).freeze

  EMBEDDABLE_TYPES = %w(video audio interactive).freeze

  private

  def can_display_as_block!
    owner.errors.add :reader_display_format, "must be resource or resource collecton for block display" unless NOTATION_TYPES.include?(owner.format)
  end

  def embeddable!
    owner.errors.add :reader_display_format, "must be video or audio resource to embed" unless owner.resource.present? && EMBEDDABLE_TYPES.include?(owner.resource.kind)
  end
end

class AnnotationReaderDisplayFormat::Inline < AnnotationReaderDisplayFormat
end

class AnnotationReaderDisplayFormat::Block < AnnotationReaderDisplayFormat
  validate :can_display_as_block!
end

class AnnotationReaderDisplayFormat::Embed < AnnotationReaderDisplayFormat::Block
  validate :embeddable!
end
