class Settings < ApplicationRecord

  validates :singleton_guard, inclusion: [0]
  merge_hash_attributes! :general

  # Authority
  include Authority::Abilities

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

  def client
    Rails.application.config.x.client
  end

end
