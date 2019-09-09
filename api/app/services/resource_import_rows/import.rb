module ResourceImportRows
  class Import < ActiveInteraction::Base

    TRUTHY_VALUES = %w(true TRUE True 1 y yes Yes YES T).freeze

    record :row, class: :resource_import_row

    def execute
      begin
        update_resource
        set_creator
        set_project
        errors.merge!(resource.errors) unless resource.save
      rescue StandardError => e
        errors.add(
          :base,
          "Unexpected import error: #{e}"
        )
      end
      {
        resource: resource,
        new_record: @new_record
      }
    end

    private

    def resource
      @resource ||= set_resource
    end

    def set_resource
      resource = row.project_resources.find_or_initialize_by fingerprint: row.fingerprint
      @new_record = resource.new_record?
      resource.resource_import_row = row
      resource
    end

    def set_fingerprint(_attribute, _value)
      resource.fingerprint = row.fingerprint
    end

    def set_creator
      resource.creator = row.creator
    end

    def set_project
      resource.project = row.project
    end

    def update_resource
      row.column_map.each do |position, attribute|
        set_attribute(attribute, row.value(position))
      end
    end

    def set_attribute(attribute, value)
      setter = setter_for(attribute)
      transformed = transform(attribute, value)
      blocker = blocker_for(attribute)
      return if blocker && send(blocker, attribute, transformed)

      send(setter, attribute, transformed)
    end

    def transform(attribute, value)
      transformer = transformers_for(attribute).detect do |t|
        respond_to? t, true
      end
      send(transformer, value)
    end

    def blocker_for(attribute)
      blockers_for(attribute).detect { |blocker| next respond_to? blocker, true }
    end

    def setter_for(attribute)
      setters_for(attribute).detect { |setter| next respond_to? setter, true }
    end

    def transformers_for(attribute)
      candidates(attribute).compact.map { |s| "transform_#{s}".to_sym }
    end

    def blockers_for(attribute)
      candidates(attribute).compact.map { |s| "block_#{s}".to_sym }
    end

    def setters_for(attribute)
      candidates(attribute).compact.map { |s| "set_#{s}".to_sym }
    end

    def candidates(attribute)
      adjusted = attribute.tr ".", "_"
      [adjusted, attribute_type(attribute), "default"]
    end

    def transform_slug(value)
      return nil if value.blank?

      value
    end

    def transform_sub_kind(value)
      return nil if value.blank?

      value
    end

    def transform_default(value)
      value
    end

    def transform_boolean(value)
      TRUTHY_VALUES.include?(value)
    end

    def set_default(attribute, value)
      resource.send("#{attribute}=", value)
    end

    def set_attachment(attribute, value)
      return if value.blank?

      set_from_google_drive_storage(attribute, value) if row.google_drive_storage?
    end

    def set_resource_collections(attribute, value)
      return set_default(attribute, []) if value.blank?

      titles = value.split(/[,;]/).map(&:strip).reject(&:empty?)
      collections = titles.map do |title|
        resource.project.resource_collections.find_or_initialize_by title: title
      end
      set_default(attribute, collections)
    end

    def set_from_google_drive_storage(attribute, value)
      adjusted = attribute.split(".").last
      file = fetch_google_drive_file(value)
      clear_or_set_attachment(adjusted, file) if file
    rescue Google::Apis::ClientError
      errors.add(
        :network,
        "Unable to fetch google drive file \"#{value}\" for #{attribute}"
      )
    end

    def clear_or_set_attachment(attribute, file)
      return resource.send(attribute).clear unless file

      set_default(attribute, file)
    end

    def fetch_google_drive_file(title)
      file = drive_folder.file_by_title(title)
      return nil unless file_ok?(file)

      drive_file_to_io(file)
    end

    def set_jsonb(path, value)
      attribute, property = path.split(".")
      resource.send(attribute.to_sym)[property] = value
    end

    def set_metadata_keywords(path, value)
      set_jsonb(path, value)
      resource.tag_list.add(value, parse: true)
    end

    def attribute_type(attribute)
      %i(jsonb boolean string text integer attachment datetime).detect do |type|
        send("#{type}_attribute?", attribute)
      end
    end

    def attachment_attribute?(attribute)
      return false unless attribute.start_with? "attachment"

      true
    end

    def jsonb_attribute?(attribute_path)
      split = "."
      return false unless attribute_path.include? split

      attribute = attribute_path.split(split).first
      resource_attribute_type(attribute) == :jsonb
    end

    def resource_attribute_type(attribute)
      Resource.type_for_attribute(attribute).type
    end

    def boolean_attribute?(attribute)
      resource_attribute_type(attribute) == :boolean
    end

    def datetime_attribute?(attribute)
      resource_attribute_type(attribute) == :datetime
    end

    def text_attribute?(attribute)
      resource_attribute_type(attribute) == :text
    end

    def integer_attribute?(attribute)
      resource_attribute_type(attribute) == :integer
    end

    def string_attribute?(attribute)
      resource_attribute_type(attribute) == :string
    end

    def file_ok?(file)
      return true unless file.nil?

      false
    end

    def drive_file_to_io(file)
      io = StringIO.new(file.download_to_string)
      io.class.class_eval { attr_accessor :original_filename, :content_type }
      io.content_type = file.mime_type
      io.original_filename = file.title
      io
    end

    def drive_folder
      @drive_folder ||= drive_session.file_by_id(row.storage_identifier)
    end

    def drive_session
      @drive_session ||= ::Factory::DriveSession.create_service_account_session
    end

    def block_special_instructions(*_args)
      true
    end

  end
end
