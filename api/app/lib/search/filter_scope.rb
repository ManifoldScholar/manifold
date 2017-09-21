module Search
  class FilterScope

    def initialize
      @filter = {}
    end

    def typeahead(typeahead, fields)
      return self unless [true, 1, "true"].include? typeahead
      @filter[:match] = :word_start
      @filter[:fields] = fields
      self
    end

    def paginate(page, per_page)
      @filter[:page] = page if page.present?
      @filter[:per_page] = per_page if per_page.present?
      self
    end

    def where(field, value, only_if_present = true)
      return self if !value.present? && only_if_present == true
      @filter[:where] ||= {}
      @filter[:where][field] = value
      self
    end

    def to_hash
      @filter
    end

  end
end
