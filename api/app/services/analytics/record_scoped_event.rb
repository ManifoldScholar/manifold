module Analytics
  class RecordScopedEvent < Analytics::RecordEvent

    object :subject, class: ApplicationRecord

    string :subject_type, default: nil
    string :subject_id, default: nil

    set_callback :type_check, :before, :set_scope

    private

    def set_scope
      return if subject.present?
      return if subject_type.blank? || subject_id.blank?

      @record = subject_type.classify.safe_constantize&.find_by(id: subject_id)
    end

  end
end
