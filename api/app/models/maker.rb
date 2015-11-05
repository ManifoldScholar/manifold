# A person or organization involved with the creation of a text
class Maker < ActiveRecord::Base
  has_many :collaborators
end
