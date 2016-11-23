# Tracks the relationship between texts and makers
class Collaborator < ActiveRecord::Base

  ROLE_CREATOR = "creator".freeze
  ROLE_CONTRIBUTOR = "contributor".freeze

  # Authority
  include Authority::Abilities

  # Associations
  belongs_to :text, optional: true
  belongs_to :maker
  belongs_to :project, optional: true

end
