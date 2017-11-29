class AddResourceMetadataField < ActiveRecord::Migration[5.0]
  def up
    add_column :resources, :metadata, :jsonb, default: {}
    Resource.all.each do |resource|
      say_with_time "Updated metadata fields for resource #{resource.id}" do
        resource.tag_list = resource.keywords
        resource.metadata["alt_text"] = resource.alt_text
        resource.metadata["rights"] = resource.copyright_status
        resource.metadata["rights_holder"] = resource.copyright_holder
        resource.metadata["credit"] = resource.credit
        resource.metadata["doi"] = resource.doi
        resource.save
      end
    end
    remove_column :resources, :keywords, :text
    remove_column :resources, :alt_text, :string
    remove_column :resources, :copyright_status, :string
    remove_column :resources, :copyright_holder, :string
    remove_column :resources, :credit, :string
    remove_column :resources, :doi, :string
  end

  def down
    add_column :resources, :keywords, :text
    add_column :resources, :alt_text, :string
    add_column :resources, :copyright_status, :string
    add_column :resources, :copyright_holder, :string
    add_column :resources, :credit, :string
    add_column :resources, :doi, :string
    Resource.all.each do |resource|
      say_with_time "Updated metadata fields for resource #{resource.id}" do
        resource.keywords = resource.metadata["keywords"]
        resource.alt_text = resource.metadata["alt_text"]
        resource.copyright_status = resource.metadata["rights"]
        resource.copyright_holder = resource.metadata["rights_holder"]
        resource.credit = resource.metadata["credit"]
        resource.doi = resource.metadata["doi"]
        resource.save
      end
    end
    remove_column :resources, :metadata, :jsonb, default: {}
  end
end
