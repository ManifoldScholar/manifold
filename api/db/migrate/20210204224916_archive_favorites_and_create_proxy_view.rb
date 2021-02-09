class ArchiveFavoritesAndCreateProxyView < ActiveRecord::Migration[6.0]
  def change
    rename_table :favorites, :legacy_favorites

    create_view :favorites
  end
end
