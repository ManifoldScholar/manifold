class PersistentUI
  # TODO: Keys here are stored as snake_case and returned as camelCase.
  # May need refactoring when /me endpoint is refactored.

  def initialize(raw_persistent_ui = {})
    self.preferences = raw_persistent_ui
  end

  attr_reader :preferences

  def preferences=(new_preferences = {}.with_indifferent_access)
    @preferences = new_preferences.with_indifferent_access

    @preferences.reverse_merge!(
      reader: { colors: {}, typography: {}, readingGroups: {} }
    )
  end

  def as_json(_options = nil)
    @preferences.deep_transform_keys { |k| k.to_s.camelize(:lower) }
  end
end
