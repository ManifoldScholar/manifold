# frozen_string_literal: true

class UpdateReadingGroupCollectionsToVersion3 < ActiveRecord::Migration[7.0]
  def change
    update_view :reading_group_collections, version: 3, revert_to_version: 2
  end
end
