module Analytics
  class RecordSearchEvent < Analytics::RecordCustomEvent

    set_callback :type_check, :before, :set_name

    validate :properties_contains_query

    private

    def set_name
      @name = Analytics::Event.event_name_for(:search)
    end

    def properties_contains_query
      errors.add(:properties, "must contain a search keyword") unless properties[:keyword].present?
    end

  end
end
