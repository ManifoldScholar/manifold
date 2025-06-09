# frozen_string_literal: true

# A prepended concern used by {ReadingGroupEntry} currently.
module ReorderableCollectionEntry
  include Dry::Effects.Reader(:collection_entry_mass_update_klasses, default: [].freeze)

  def act_as_list_no_update?
    self.class.in?(collection_entry_mass_update_klasses) || super
  end
end
