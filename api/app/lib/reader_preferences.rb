class ReaderPreferences
  def initialize(raw_reader_preferences = {})
    self.preferences = raw_reader_preferences
  end

  attr_reader :preferences

  def preferences=(new_preferences = {}.with_indifferent_access)
    @preferences = new_preferences.with_indifferent_access

    @preferences.reverse_merge!(colors: {}, typography: {}, readingGroups: {})
  end

  def as_json(options = nil)
    @preferences.as_json(options)
  end
end
