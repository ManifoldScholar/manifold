module TableOfContentsWithCollected
  extend ActiveSupport::Concern

  def toc_with_collected_for(user)
    return toc if toc.blank? || user.blank? || user.anonymous?

    text_section_ids = user.text_sections.where(text: self).ids

    return toc if text_section_ids.blank?

    entries = { toc: toc }.with_indifferent_access[:toc]

    augment_toc_children_with_collected(entries, ids: text_section_ids)
  end

  # @!scope private
  # @param [<Hash>] entries
  # @param [<String>] ids
  # @return [<Hash>]
  def augment_toc_children_with_collected(entries, ids:)
    return nil if entries.blank?

    entries.map do |entry|
      augment_toc_entry_with_collected(entry, ids: ids)
    end
  end

  # @!scope private
  # @param [Hash] entry
  # @param [<String>] ids
  # @return [Hash]
  def augment_toc_entry_with_collected(entry, ids:)
    entry.collected = entry[:id].in?(ids)
    entry.children = augment_toc_children_with_collected(entry[:children], ids: ids)
    entry
  end
end
