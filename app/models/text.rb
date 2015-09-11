require 'memoist'

class Text < ActiveRecord::Base

  extend Memoist

  serialize :structure_titles, Hash
  serialize :toc, Array
  serialize :page_list, Array
  serialize :landmarks, Array

  has_many :collaborators
  has_many :makers, :through => :collaborators
  has_many :creators, -> { where '"collaborators"."role" = ?', 'creator' }, :through => :collaborators, :source => "maker"
  has_many :contributors, -> { where '"collaborators"."role" = ?', 'contributor' }, :through => :collaborators, :source => "maker"
  has_many :titles, class_name: 'TextTitle'
  has_many :text_subjects
  has_many :subjects, :through => :text_subjects
  has_many :ingestion_sources
  has_many :source_resources, :through => :ingestion_sources, :source => :resource
  has_many :text_sections

  validates :unique_identifier, presence: true

  def title()
    if new_record?
      title = titles.to_ary.find { |title| title.kind == TextTitle::KIND_MAIN }
      if title
        title.value || 'untitled'
      else
        'untitled'
      end
    else
      titles.where(:kind => TextTitle::KIND_MAIN).first().value
    end
  end

  def find_ingestion_source_by_identifier(identifier)
    ingestion_sources.to_ary.find { |is| is.source_identifier == identifier }
  end

  def find_text_section_by_source_path(path)
    source = ingestion_sources.to_ary.find { |is| is.source_path == path }
    if source
      source_id = source.source_identifier
      text_section = text_sections.to_ary.find { |cd| cd.source_identifier == source_id }
      return text_section
    end
  end

  def section_source_map
    map = {}
    text_sections.each do |ts|
      resource = ts.resource
      source = ingestion_sources.where(:resource => resource).first
      path = source.source_path
      map[path] = ts
    end
    return map
  end
  memoize :section_source_map

  def ingestion_resource_map
    map = {}
    ingestion_sources.each do |s|
      map[s.source_path] = s.resource.attachment.url
    end
    map
  end
  memoize :ingestion_resource_map

  def creator_names()
    creators.pluck(:name).join(', ')
  end

  def cover_url
    cover_source = ingestion_sources.where(:kind => IngestionSource::KIND_COVER_IMAGE).first
    if cover_source
      cover_source.resource.attachment.url
    else
      nil
    end
  end

  def toc_section
    text_sections.where(:kind => TextSection::KIND_NAVIGATION).first
  end


end
