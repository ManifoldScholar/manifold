module FlaggableResource
  extend ActiveSupport::Concern

  included do
    has_many :flags, as: :flaggable, dependent: :destroy, inverse_of: :flaggable
  end

  def flagged?
    flags_count.positive?
  end
end
