# frozen_string_literal: true

class ProjectSummary < ApplicationRecord
  include Attachments
  include View

  self.primary_key = :id

  belongs_to :project, inverse_of: :project_summary

  delegate :collected_by?, :entitlement_subject_url, :creator_names, :exclude_from_oai, to: :project

  manifold_has_attached_file :avatar, :image

  def updated?
    updated_at.strftime("%F") != created_at.strftime("%F")
  end

  def creator_ids
    []
  end

  def journal_issue?
    false
  end

  def recently_updated?
    updated? && updated_at >= 1.week.ago
  end
end
