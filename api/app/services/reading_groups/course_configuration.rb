module ReadingGroups
  class CourseConfiguration
    include StoreModel::Model

    attribute :enabled, :boolean, default: false
    attribute :starts_on, :date
    attribute :ends_on, :date

    alias enabled? enabled

    alias reading_group parent
  end
end
