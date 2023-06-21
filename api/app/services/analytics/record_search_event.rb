module Analytics
  class RecordSearchEvent < Analytics::RecordCustomEvent

    validate :properties_contains_query

    private

    def valid_name
      Analytics::Event.event_name_for(:search)
    end

    def properties_contains_query
      errors.add(:properties, "must contain a search keyword") unless properties[:keyword].present?
    end

  end
end
