class AddSubKindToResources < ActiveRecord::Migration[5.0]
  def up
    add_column :resources, :sub_kind, :string
    Resource.where(is_external_video: true).each do |resource|
      resource.sub_kind = "external_video"
      resource.save
    end
    Resource.where(is_iframe: true).each do |resource|
      resource.sub_kind = "iframe"
      resource.save
    end
    Resource.where("embed_code IS NOT NULL").each do |resource|
      resource.sub_kind = "embed"
      resource.save
    end
    remove_column :resources, :is_external_video, :boolean
    remove_column :resources, :is_iframe, :boolean
  end

  def down
    add_column :resources, :is_external_video, :boolean
    add_column :resources, :is_iframe, :boolean
    Resource.where(sub_kind: "external_video").each do |resource|
      resource.is_external_video = true
      resource.save
    end
    Resource.where(sub_kind: "iframe").each do |resource|
      resource.is_iframe = true
      resource.save
    end
    remove_column :resources, :sub_kind, :string
  end


end
