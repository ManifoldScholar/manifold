# frozen_string_literal: true

# Organizes {ManifoldOAIRecord} into hierarchical sets.
#
# @see ManifoldOAISetSource
class ManifoldOAISet < ApplicationRecord
  belongs_to :source, polymorphic: true, optional: true

  has_many :manifold_oai_set_links, inverse_of: :manifold_oai_set, dependent: :destroy

  has_many :records, through: :manifold_oai_set_links, source: :manifold_oai_record

  scope :by_spec, ->(spec) { where(spec:) }

  validates :spec, :name, presence: true
  validates :spec, uniqueness: true

  def link!(*records_or_sources)
    records_or_sources.flatten!

    ManifoldApi::Container["manifold_oai.link_set"].call(self, records_or_sources).value!
  end

  # @api private
  # @return [ManifoldOAISet]
  def normalize_projects_set!
    self.source = nil
    self.name = "Projects"
    self.description = "A list of all projects in this Manifold installation."

    save!

    return self
  end

  # @api private
  # @return [ManifoldOAISet]
  def normalize_journals_set!
    self.source = nil
    self.name = "Journals"
    self.description = "A list of all journals in this Manifold installation."

    save!

    return self
  end

  class << self
    # @return [ManifoldOAISet]
    def fetch_projects!
      where(spec: "projects").first_or_initialize.tap(&:normalize_projects_set!)
    end

    # @return [ManifoldOAISet]
    def fetch_journals!
      where(spec: "journals").first_or_initialize.tap(&:normalize_journals_set!)
    end
  end
end
