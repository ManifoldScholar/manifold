# Tracks the relationship between texts and makers
class Collaborator < ActiveRecord::Base
  belongs_to :text, optional: true
  belongs_to :maker
end
