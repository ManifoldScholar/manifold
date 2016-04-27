class Favorite < ActiveRecord::Base
  belongs_to :user
  belongs_to :favoritable, :polymorphic => true
  validates_uniqueness_of :favoritable_id, :scope => [:user_id, :favoritable_type]

  scope :only_projects, -> { where(favoritable_type: "Project") }
  scope :only_texts, -> { where(favoritable_type: "Text") }

end
