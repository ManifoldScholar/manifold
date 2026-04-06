# frozen_string_literal: true

# A view that calculates counts and other metadata for a {FlaggableResource}
# based on uniquely associated {Flag} records.
class FlagStatus < ApplicationRecord
  include View

  self.primary_key = :flaggable_id

  belongs_to :flaggable, inverse_of: :flag_status, polymorphic: true

  COUNTS = %i[
    flags_count
    resolved_flags_count
    unresolved_flags_count
  ].freeze

  EMPTY_DATA = {
    flagger_ids: [].freeze,
    flags_count: 0,
    resolved_flags_count: 0,
    unresolved_flags_count: 0,
  }.freeze

  # @return [Hash]
  def to_data
    slice(*EMPTY_DATA.keys).symbolize_keys
  end
end
