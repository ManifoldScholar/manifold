module Search
  class FilterScope

    def initialize
      @filter = {}
    end

    def typeahead(typeahead, fields)
      return self unless typeahead == true || typeahead == 1 || typeahead == "true"
      @filter[:match] = :word_start
      @filter[:fields] = fields
      self
    end

    def paginate(page, per_page)
      @filter[:page] = page if page.present?
      @filter[:per_page] = per_page if per_page.present?
      self
    end

    def to_hash
      @filter
    end

  end
end
