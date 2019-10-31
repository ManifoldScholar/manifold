class CachedExternalSourceLink < ApplicationRecord
  upsert_keys %i[cached_external_source_id text_id]

  belongs_to :cached_external_source, inverse_of: :links
  belongs_to :text, inverse_of: :cached_external_source_links

  scope :by_cached_external_source, ->(ces) { where(cached_external_source: ces) }
  scope :by_text, ->(text) { where(text: text) }

  validates :text_id, uniqueness: { scope: %i[cached_external_source_id], on: :update }
end
