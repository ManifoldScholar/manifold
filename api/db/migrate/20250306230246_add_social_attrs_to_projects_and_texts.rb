class AddSocialAttrsToProjectsAndTexts < ActiveRecord::Migration[6.1]
  def change
    change_table :projects do |t|
      t.jsonb :social_image_data, default: nil
      t.text :social_description
      t.text :social_title
    end

    change_table :texts do |t|
      t.jsonb :social_image_data, default: nil
      t.text :social_description
      t.text :social_title
    end
  end
end
