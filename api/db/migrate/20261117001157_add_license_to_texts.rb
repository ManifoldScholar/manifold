# frozen_string_literal: true

class AddLicenseToTexts < ActiveRecord::Migration[7.0]
  def change
    add_column :texts, :license, :string
  end
end
