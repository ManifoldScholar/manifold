class Collaborator < ActiveRecord::Base

  belongs_to :text
  belongs_to :maker

end
