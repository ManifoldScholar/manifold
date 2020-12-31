class CreateTextTitleSummaries < ActiveRecord::Migration[6.0]
  def change
    create_view :text_title_summaries
  end
end
