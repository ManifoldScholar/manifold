class UpdateTextSummariesToVersion7 < ActiveRecord::Migration[6.0]
  def change
    update_view :text_summaries, version: 7, revert_to_version: 6
  end
end
