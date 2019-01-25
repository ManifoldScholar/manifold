class CallToAction < ApplicationRecord

  # Authorization
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor

  # Ordering
  acts_as_list scope: :project

  # Relationships
  belongs_to :project
  belongs_to :text, optional: true

  # Validations
  validates :title, :kind, :location, presence: true
  validates :text, presence: true, if: :requires_text?

  enum kind: [:start_reading, :table_of_contents, :download, :link, :button]
  enum location: [:content, :aside]

  private

  def requires_text?
    start_reading? || table_of_contents?
  end

end
