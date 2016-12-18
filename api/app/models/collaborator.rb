# Tracks the relationship between texts and makers
class Collaborator < ActiveRecord::Base

  ROLE_CREATOR = "creator".freeze
  ROLE_CONTRIBUTOR = "contributor".freeze

  acts_as_list scope: [:collaboratable_id, :collaboratable_type]

  # Authority
  include Authority::Abilities

  # Associations
  belongs_to :collaboratable, polymorphic: true
  belongs_to :maker

  def to_s
    "#{role} #{maker}"
  end

end
