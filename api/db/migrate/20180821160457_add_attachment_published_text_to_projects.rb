class AddAttachmentPublishedTextToProjects < ActiveRecord::Migration[5.0]
  def change
    add_attachment :projects, :published_text_attachment
  end
end
