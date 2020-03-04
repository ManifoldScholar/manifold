class Ahoy::Event < ApplicationRecord
  include Ahoy::QueryMethods
  include ClassyEnum::ActiveRecord

  self.table_name = "ahoy_events"

  classy_enum_attr :name, allow_blank: true, class_name: "AhoyEventType"

  before_validation :set_happened_on!, on: :create

  belongs_to :visit
  belongs_to :user, optional: true

  def set_happened_on!
    self.date = Date.current
  end

end
