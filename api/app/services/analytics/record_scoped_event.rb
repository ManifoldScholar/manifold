module Analytics
  class RecordScopedEvent < Analytics::RecordEvent

    object :scope, class: ApplicationRecord

    string :scope_type, default: nil
    string :scope_id, default: nil

    set_callback :type_check, :before, :set_scope

    private

    def set_scope
      return if scope.present?
      return if scope_type.blank? || scope_id.blank?

      @scope = scope_type.classify.safe_constantize&.find_by(id: scope_id)
    end

  end
end
