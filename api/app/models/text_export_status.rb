class TextExportStatus < ApplicationRecord
  include Concerns::View

  PRUNABLE_AGE = 1.week

  belongs_to :text, inverse_of: :text_export_statuses
  belongs_to :text_export, inverse_of: :text_export_statuses

  scope :autoexported, -> { where(autoexport: true) }
  scope :by_text, ->(text) { where(text: text) }
  scope :by_text_export, ->(text_export) { where(text_export: text_export) }
  scope :current, -> { where(current: true) }
  scope :current_text_ids, -> { current.select(:text_id) }
  scope :stale, -> { where(stale: true) }
  scope :exported_before, ->(time) { where(arel_table[:exported_at].lt(time)) }
  scope :prunable, -> { stale.exported_before(PRUNABLE_AGE.ago) }
  scope :prunable_export_ids, -> { prunable.select(:text_export_id) }
end
