class UpdateTextSummariesToVersion5 < ActiveRecord::Migration[6.0]
  def change
    update_view :text_summaries, version: 5, revert_to_version: 4
  end
end
