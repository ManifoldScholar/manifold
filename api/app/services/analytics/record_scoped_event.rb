module Analytics
  class RecordScopedEvent < Analytics::RecordEvent

    object :record, class: ApplicationRecord

    string :record_type, default: nil
    string :record_id, default: nil

    set_callback :type_check, :before, :set_scope

    private

    def set_scope
      return if record.present?
      return if record_type.blank? || record_id.blank?

      @record = record_type.classify.safe_constantize&.find_by(id: record_id)
    end

  end
end
