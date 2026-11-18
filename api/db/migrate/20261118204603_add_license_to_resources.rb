# frozen_string_literal: true

class AddLicenseToResources < ActiveRecord::Migration[7.0]
  def change
    add_column :resources, :license, :string
  end
end
