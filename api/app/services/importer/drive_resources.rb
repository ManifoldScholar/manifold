require "json"

module Importer
  class ImportDriveResourcesError < StandardError
  end

  # This class imports an existing project's resources into Manifold from a Google drive
  # sheet and a google drive directory
  class DriveResources

    REQUIRED_RESOURCE_COLUMNS = %w(Title Filename).freeze
    REQUIRED_COLLECTION_COLUMNS = %w(Title Thumbnail).freeze
    COLLECTION_SIMPLE_ATTRIBUTES = {
      "Title" => :title,
      "Description" => :description
    }.freeze

    COLLECTION_BOOLEAN_ATTRIBUTES = {}.freeze
    COLLECTION_ATTACHMENT_ATTRIBUTES = {
      "Thumbnail" => :thumbnail
    }.freeze

    RESOURCE_SIMPLE_ATTRIBUTES = {
      "Title" => :title,
      "Caption" => :caption,
      "Description" => :description,
      "URL" => :external_url,
      "Host Name" => :external_type,
      "File ID" => :external_id,
      "Type" => :kind,
      "Sub Type" => :sub_kind
    }.freeze
    RESOURCE_METADATA_ATTRIBUTES = {
      "Alt-Text" => :alt_text,
      "Keywords" => :keywords,
      "Copyright Status" => :copyright_status,
      "Copyright Holder" => :copyright_holder,
      "Credit Line" => :credit,
      "Series Title" => :series_title,
      "Container Title" => :container_title,
      "ISBN" => :isbn,
      "ISSN" => :issn,
      "DOI" => :doi,
      "Original Publisher" => :original_publisher,
      "Original Publisher Place" => :original_publisher_place,
      "Original Title" => :original_title,
      "Publisher" => :publisher,
      "Publisher Place" => :publisher_place,
      "Version" => :version,
      "Series Number" => :series_number,
      "Edition" => :edition,
      "Issue" => :issue,
      "Volume" => :volume,
      "Rights" => :rights,
      "Rights Territory" => :rights_territory,
      "Restrictions" => :restrictions,
      "Rights Holder" => :rights_holder,
      "Creator" => :creator
    }.freeze
    RESOURCE_BOOLEAN_ATTRIBUTES = {
      "Allow High-Res Download" => :allow_high_res
    }.freeze
    RESOURCE_ATTACHMENT_ATTRIBUTES = {
      "Filename" => :attachment,
      "High Res" => :high_res,
      "Transcript" => :transcript
    }.freeze

    TRUTHY_VALUES = %w(true TRUE True 1 y yes Yes YES T).freeze

    def initialize(project_id, sheet_id, drive_folder_id, creator, logger = Rails.logger)
      @project = ::Project.find(project_id)
      @creator = creator
      @sheet_id = sheet_id
      @drive_folder_id = drive_folder_id
      @logger = Helpers::Logger.new(logger)
      @touched = Set.new
    end

    def import
      @logger.info "Importing resources for project: #{@project.title}"
      begin
        pre_import_validation
        Helpers::List.new(collections_sheet).each do |row|
          import_collection(row)
        end
        Helpers::List.new(resources_sheet).each do |row, count|
          import_resource(row, count)
        end
      rescue ImportDriveResourcesError
        @logger.error("Failed to import resources for #{@project.title} [#{@project.id}]")
      end
    end

    private

    def pre_import_validation
      validate_spreadsheet
      validate_resources_sheet
      validate_collections_sheet
    end

    def import_collection(row)
      @logger.info "Importing collection: \"#{row['Title']}\""
      collection = find_or_initialize_collection(fingerprint(row))
      update_simple_attributes(collection, row, COLLECTION_SIMPLE_ATTRIBUTES)
      update_boolean_attributes(collection, row, COLLECTION_BOOLEAN_ATTRIBUTES)
      update_attachment_attributes(collection, row, COLLECTION_ATTACHMENT_ATTRIBUTES)
      return collection.save if collection.valid?

      @logger.log_model_errors(collection)
    end

    def import_resource(row, count)
      return if TRUTHY_VALUES.include?(row["Skip"])

      @logger.info "Importing row: \"#{row['Title']}\""
      resource = find_or_initialize_resource(fingerprint(row))
      resource.creator = @creator
      update_simple_attributes(resource, row, RESOURCE_SIMPLE_ATTRIBUTES)
      update_metadata_attributes(resource, row, RESOURCE_METADATA_ATTRIBUTES)
      update_boolean_attributes(resource, row, RESOURCE_BOOLEAN_ATTRIBUTES)
      update_attachment_attributes(resource, row, RESOURCE_ATTACHMENT_ATTRIBUTES)
      create_tag_list(resource, row)
      if resource.valid?
        resource.save
        add_resource_to_collection(resource, row["Collection"], count)
        return
      end
      @logger.log_model_errors(resource)
    end

    def create_tag_list(resource, row)
      return unless row["Keywords"]

      resource.tag_list.add(row["Keywords"], parse: true)
    end

    def add_resource_to_collection(resource, collection_list, count)
      return if collection_list.empty?

      collections = collection_list.split(";")
      collections.each do |collection_title|
        @logger.info "   Attempting to add resource to collection \"#{collection_title}\""
        collection = @project.resource_collections.find_by(title: collection_title)
        return @logger.log_missing_collection unless collection
        return @logger.log_already_in_collection if
          resource.resource_collections.include?(collection)

        remove_resource_from_all_collections(resource)
        @logger.info "        Resource does not belong to collection. Adding."
        create_collection_resource(collection, resource, count)
      end
    end

    def remove_resource_from_all_collections(resource)
      resource.collection_resources.each do |cr|
        @logger.info "        Remove resource from collection: #{cr.title}"
        cr.destroy
      end
    end

    def create_collection_resource(collection, resource, position)
      cr = CollectionResource.create(
        resource_collection: collection,
        resource: resource,
        position: position
      )
      return @logger.log_model_errors(cr) unless cr.valid?

      cr
    end

    def update_simple_attributes(model, row, simple_attributes)
      attr = attributes_from_row(row, simple_attributes)
      model.assign_attributes(attr)
    end

    def update_metadata_attributes(model, row, simple_attributes)
      attr = attributes_from_row(row, simple_attributes)
      model.assign_attributes(metadata: attr)
    end

    def update_attachment_attributes(model, row, attachment_attributes)
      attachment_attributes.each do |sheet_attr, model_attr|
        import_model_attachment(model, model_attr, row[sheet_attr])
      rescue Google::Apis::TransmissionError
        @logger.warn "    Caught Google::Apis::TransmissionError. Trying again"
        import_model_attachment(model, model_attr, row[sheet_attr])
      end
    end

    def update_boolean_attributes(model, row, boolean_attributes)
      boolean_attributes.each do |sheet_attr, model_attr|
        value = TRUTHY_VALUES.include?(row[sheet_attr]) ? true : false
        model.send("#{model_attr}=", value)
      end
    end

    def import_model_attachment(model, key, value)
      return if value.blank?

      @logger.info "    Importing #{key}: #{value}"
      file = drive_folder.file_by_title(value)
      return unless file_ok?(file)
      return if already_downloaded?(file, model, key)

      @logger.log_found_file(file)
      io = io_from_drive_file(file)
      set_file_attribute(file, model, key, io)
    end

    def set_file_attribute(file, model, key, io)
      model.send("#{key}=", io)
      saved_file_checksum = checksum_for_pending_attachment(model, key)
      @logger.info "            Content type: #{file.mime_type}"
      @logger.info "            Saved file checksum is #{saved_file_checksum}"
      raise_attachment_save_error if saved_file_checksum != file.md5_checksum
      model.send("#{key}_checksum=", saved_file_checksum)
    end

    def checksum_for_pending_attachment(model, key)
      tmp_path = model.send(key.to_s).open
      Digest::MD5.hexdigest(File.read(tmp_path))
    ensure
      tmp_path.close unless tmp_path.closed?
    end

    def io_from_drive_file(file)
      @logger.log_start_download(file)
      io = StringIO.new(file.download_to_string)
      @logger.log_download(file, io)
      io.class.class_eval { attr_accessor :original_filename, :content_type }
      io.content_type = file.mime_type
      io.original_filename = file.title
      io
    end

    def file_ok?(file)
      return true unless file.nil?

      @logger.log_missing_file(file)
      false
    end

    def already_downloaded?(file, model, key)
      method = "#{key}_checksum"
      return false unless model.respond_to? method
      return false if file.md5_checksum != model.send(method)

      @logger.log_unchanged_file(file)
      true
    end

    def attributes_from_row(row, attr_list)
      attr_list.each_with_object({}) do |pair, out|
        out[pair[1]] = row[pair[0]]
      rescue GoogleDrive::Error => e
        @logger.log_google_drive_error e
        next
      end
    end

    def fingerprint(row)
      candidates = ["Local ID", "Filename", "URL", "Title"]
      field = candidates.detect do |candidate|
        row.key?(candidate) && !row[candidate].blank?
      end
      fingerprint = Digest::MD5.hexdigest(row[field])
      @logger.log_fingerprint(fingerprint)
      fingerprint
    end

    def validate_resources_sheet
      raise_missing_sheet_error("resources") if resources_sheet.nil?
      raise_missing_column_error(resources_sheet) unless
        (REQUIRED_RESOURCE_COLUMNS - Helpers::List.new(resources_sheet).keys).blank?
    end

    def validate_spreadsheet
      raise_missing_spreadsheet_error if spreadsheet.nil?
    end

    def validate_collections_sheet
      raise_missing_sheet_error("collections") if collections_sheet.nil?
      raise_missing_column_error(collections_sheet) unless
        (REQUIRED_COLLECTION_COLUMNS - Helpers::List.new(collections_sheet).keys).blank?
    end

    def find_or_initialize_resource(fingerprint)
      resource = @project.resources.find_or_initialize_by fingerprint: fingerprint
      @logger.info "    Found existing resource with id #{resource.id}" unless resource.new_record?
      @logger.info "    No resource exists for fingerprint. Creating new resource" if resource.new_record?

      resource
    end

    def find_or_initialize_collection(fingerprint)
      collection = @project.resource_collections
        .find_or_initialize_by fingerprint: fingerprint
      @logger.info "    Found existing resource collection with id #{collection.id}" unless collection.new_record?
      @logger.info "    No collection exists for fingerprint. Creating new collection" if collection.new_record?

      collection
    end

    def raise_missing_spreadsheet
      msg = "Unable to access spreadsheet with ID #{@sheet_id}"
      @logger.error(Rainbow(msg).red)
      raise ImportDriveResourcesError
    end

    def raise_missing_sheet_error(sheet_name)
      msg = "\"#{spreadsheet.title}\" is missing a worksheet called \"#{sheet_name}\""
      @logger.error(Rainbow(msg).red)
      raise ImportDriveResourcesError
    end

    def raise_missing_column_error(worksheet)
      # rubocop:disable Layout/LineLength
      msg = "\"#{worksheet.title}\" sheet in \"#{worksheet.spreadsheet.title}\" is missing required column(s): #{(REQUIRED_RESOURCE_COLUMNS - Helpers::List.new(worksheet).keys).join(', ')}"
      # rubocop:enable Layout/LineLength
      @logger.error(Rainbow(msg).red)
      raise ImportDriveResourcesError
    end

    def raise_attachment_save_error
      msg = "Saved attachment checksum does not match checksum reported by Google Drive."
      @logger.error(Rainbow(msg).red)
      raise ImportDriveResourcesError
    end

    def drive_folder
      @drive_folder ||= session.file_by_id(@drive_folder_id)
    end

    def spreadsheet
      @spreadsheet ||= session.spreadsheet_by_key(@sheet_id)
    end

    def resources_sheet
      @resources_sheet ||= spreadsheet.worksheet_by_title("Resource Metadata")
    end

    def collections_sheet
      @collections_sheet ||= spreadsheet.worksheet_by_title("Collection Metadata")
    end

    def session
      @session ||= ::Factory::DriveSession.create_service_account_session
    end
  end
end
