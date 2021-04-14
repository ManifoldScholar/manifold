module SearchIndexable
  extend ActiveSupport::Concern

  def search_result_type
    self.class.name.underscore
  end
end
