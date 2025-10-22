class MoveResourceAltFromMetadataToAttachment < ActiveRecord::Migration[7.0]
  def up
    Resource.all.each do |resource|
      next unless resource.kind == "image" && resource.attachment?

      say_with_time "Migrating alt text to attachment for #{resource.id}" do
        resource.attachment.metadata["alt_text"] = resource.metadata["alt_text"]
        resource.save
      end
    end
  end

  def down
    Resource.all.each do |resource|
      next unless resource.kind == "image" && resource.attachment?

      say_with_time "Migrating alt text to metadata for #{resource.id}" do
        resource.metadata["alt_text"] = resource.attachment.metadata["alt_text"]
        resource.save
      end
    end
  end
end
