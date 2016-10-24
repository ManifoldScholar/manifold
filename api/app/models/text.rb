require "memoist"

# A single Text
class Text < ActiveRecord::Base
  extend Memoist

  serialize :structure_titles, Hash
  serialize :toc, Array
  serialize :page_list, Array
  serialize :landmarks, Array

  include Collaborative
  include TrackedCreator

  has_many :titles, class_name: "TextTitle"
  has_many :text_subjects
  has_many :subjects, through: :text_subjects
  has_many :ingestion_sources
  has_many :source_resources, through: :ingestion_sources, source: :resource
  has_many :text_sections, -> { order(position: :asc) }
  has_many :stylesheets
  has_many :favorites, as: :favoritable
  belongs_to :project, optional: true
  belongs_to :category, optional: true

  validates :unique_identifier, presence: true

  def title
    main_title = if new_record?
                   titles.to_ary.find { |a_title| a_title.kind == TextTitle::KIND_MAIN }
                 else
                   titles.find_by(kind: TextTitle::KIND_MAIN)
                 end
    return "untitled" unless main_title
    main_title.value
  end

  def section_before(position)
    # text_sections.where("position > ?", position)
  end

  def section_after(position)
  end

  def section_at(position)
    text_sections.find_by(position: position)
  end

  def find_ingestion_source_by_identifier(identifier)
    ingestion_sources.to_ary.find { |is| is.source_identifier == identifier }
  end

  def find_text_section_by_source_path(path)
    source = ingestion_sources.to_ary.find { |is| is.source_path == path }
    return unless source
    source_id = source.source_identifier
    text_sections.to_ary.find { |cd| cd.source_identifier == source_id }
  end

  def section_source_map
    map = {}
    text_sections.each do |ts|
      next if ts.ingestion_source.nil?
      path = ts.ingestion_source.source_path
      map[path] = ts
    end
    map
  end
  memoize :section_source_map

  def source_path_map
    map = {}
    ingestion_sources.each do |s|
      map[s.source_path] = s.attachment.url
    end
    map
  end
  memoize :source_path_map

  def cover
    ingestion_sources.find_by(kind: IngestionSource::KIND_COVER_IMAGE)
  end

  def cover_url
    cover_source = ingestion_sources.find_by(kind: IngestionSource::KIND_COVER_IMAGE)
    return nil unless cover_source.try(:resource).try(:attachment_url)
    ENV["API_DOMAIN"] + cover_source.resource.attachment.url if cover_source
  end

  def toc_section
    text_sections.find_by(kind: TextSection::KIND_NAVIGATION)
  end

  def published?
    project && project.published_text == self
  end
end
