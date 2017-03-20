module ResourceValidation
  extend ActiveSupport::Concern

  def validate_image_fields
    errors.add(:attachment, "image is required") unless attachment.present?
    errors.empty?
  end

  def validate_audio_fields
    errors.add(:attachment, "audio is required") unless attachment.present?
    errors.empty?
  end

  def validate_video_fields
    errors.add(:external_url, "can't be blank") unless external_url.present? || attachment.present?
    errors.add(:external_type, "is required") unless external_type.present? || attachment.present?
    errors.add(:attachment, "video is required") unless attachment.present? || (external_url.present? && external_type.present?)
    errors.empty?
  end

  def validate_pdf_fields
    errors.add(:attachment, "pdf is required") unless attachment.present?
    errors.empty?
  end

  def validate_document_fields
    errors.add(:attachment, "document is required") unless attachment.present?
    errors.empty?
  end

  def validate_spreadsheet_fields
    errors.add(:attachment, "spreadsheet is required") unless attachment.present?
    errors.empty?
  end

  def validate_presentation_fields
    errors.add(:attachment, "presentation is required") unless attachment.present?
    errors.empty?
  end

  def validate_link_fields
    errors.add(:external_url, "can't be blank") if external_url.blank?
    errors.empty?
  end

end
