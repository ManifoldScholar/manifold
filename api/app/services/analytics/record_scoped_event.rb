module Analytics
  class RecordScopedEvent < Analytics::RecordEvent

    object :record, class: ApplicationRecord, default: nil

    string :record_type, default: nil
    string :record_id, default: nil

    def valid_record
      @valid_record ||= set_valid_record
    end

    private

    def set_valid_record
      return record if record.present?
      return record if record_type.blank? || record_id.blank?

      record_type.classify.safe_constantize&.find_by(id: record_id)
    end

  end
end
