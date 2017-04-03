class Settings < ApplicationRecord

  # Concerns
  include Authority::Abilities
  include Attachments

  # Validation
  validates :singleton_guard, inclusion: [0]

  # Attachments
  manifold_has_attached_file :press_logo, :image

  def self.instance
    row = first
    raise ActiveRecord::RecordNotFound unless row
    row
  rescue ActiveRecord::RecordNotFound
    # slight race condition here, but it will only happen once
    row = Settings .new
    row.singleton_guard = 0
    row.save!
    row
  end

  def general=(value)
    base = general || {}
    new = base.merge(value)
    self[:general] = new
  end

end
