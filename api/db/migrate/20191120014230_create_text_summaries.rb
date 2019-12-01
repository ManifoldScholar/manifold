class CreateTextSummaries < ActiveRecord::Migration[5.2]
  def change
    create_view :text_summaries
  end
end
