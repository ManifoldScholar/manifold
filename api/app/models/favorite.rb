class Favorite < ActiveRecord::Base
  belongs_to :user
  belongs_to :favoritable, :polymorphic => true
end
