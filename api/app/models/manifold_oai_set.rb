# frozen_string_literal: true

# Organizes {ManifoldOAIRecord} into hierarchical sets.
#
# @see ManifoldOAISetSource
class ManifoldOAISet < ApplicationRecord
  belongs_to :source, polymorphic: true, optional: true

  has_many :manifold_oai_set_links, inverse_of: :manifold_oai_set, dependent: :destroy

  has_many :records, through: :manifold_oai_set_links, source: :manifold_oai_record

  scope :by_spec, ->(spec) { where(spec:) }

  # Record matching spec + its descendants
  #
  # @param [String] spec
  # @return [ActiveRecord::Relation<ManifoldOAISet>]
  def self.within_spec(spec)
    descendants = "#{sanitize_sql_like(spec)}:%"

    where(arel_table[:spec].eq(spec).or(arel_table[:spec].matches(descendants)))
  end

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
    self.description = dublin_core_summary("A list of all projects in this Manifold installation.")

    save!

    return self
  end

  # @api private
  # @return [ManifoldOAISet]
  def normalize_journals_set!
    self.source = nil
    self.name = "Journals"
    self.description = dublin_core_summary("A list of all journals in this Manifold installation.")

    save!

    return self
  end

  # @api private
  # @return [ManifoldOAISet]
  def normalize_directory_set!
    self.source = nil
    self.name = "Directory"
    self.description = dublin_core_summary("A list of projects and journals in this installation that should be included in the Manifold Directory")

    save!

    return self
  end

  # @api private
  # @return [ManifoldOAISet]
  def normalize_issues_set!
    self.source = nil
    self.name = "Issues"
    self.description = dublin_core_summary("All journal issues in this Manifold installation.")

    save!

    return self
  end

  # @api private
  # @return [ManifoldOAISet]
  def normalize_project_collections_set!
    self.source = nil
    self.name = "Project Collections"
    self.description = dublin_core_summary("All project collections in this Manifold installation.")

    save!

    return self
  end

  private

  # @param [String] summary
  # @return [String]
  def dublin_core_summary(summary)
    ManifoldOAI::DublinCoreDocument.minimal(title: name, description: summary)
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

    # @return [ManifoldOAISet, nil]
    def fetch_directory!
      return nil unless Settings.instance.oai.directory_enabled?

      where(spec: "directory").first_or_initialize.tap(&:normalize_directory_set!)
    end

    # @return [ManifoldOAISet]
    def fetch_issues!
      where(spec: "issues").first_or_initialize.tap(&:normalize_issues_set!)
    end

    # @return [ManifoldOAISet]
    def fetch_project_collections!
      where(spec: "projectCollections").first_or_initialize.tap(&:normalize_project_collections_set!)
    end
  end
end
