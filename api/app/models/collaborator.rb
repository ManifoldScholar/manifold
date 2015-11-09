# Tracks the relationship between texts and makers
class Collaborator < ActiveRecord::Base
  belongs_to :text
  belongs_to :maker
end
