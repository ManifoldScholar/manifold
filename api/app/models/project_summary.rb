# frozen_string_literal: true

class ProjectSummary < ApplicationRecord
  include Attachments
  include View

  self.primary_key = :id

  belongs_to :project, inverse_of: :project_summary

  delegate :collected_by?, to: :project
  delegate :entitlement_subject_url, to: :project
  delegate :creator_names, to: :project

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
