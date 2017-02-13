require "json"

module Importer
  class ImportDriveResourcesError < StandardError
  end

  # This class imports an existing project's resources into Manifold from a Google drive
  # sheet and a google drive directory
  # rubocop:disable ClassLength
  class DriveResources

    REQUIRED_RESOURCE_COLUMNS = %w(title attachment).freeze
    REQUIRED_COLLECTION_COLUMNS = %w(title thumbnail).freeze
    COLLECTION_SIMPLE_ATTRIBUTES = %w(title description).freeze
    COLLECTION_BOOLEAN_ATTRIBUTES = %w().freeze
    COLLECTION_ATTACHMENT_ATTRIBUTES = %w(thumbnail).freeze
    RESOURCE_SIMPLE_ATTRIBUTES = %w(
      title kind caption description alt_text keywords copyright_status copyright_holder
      credit external_url external_type external_id
    ).freeze
    RESOURCE_BOOLEAN_ATTRIBUTES = %w(allow_high_res allow_download).freeze
    RESOURCE_ATTACHMENT_ATTRIBUTES = %w(attachment high_res transcript).freeze
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
        collections_sheet.list.each do |row|
          import_collection(row)
        end
        resources_sheet.list.each do |row, count|
          import_resource(row, count)
        end
      rescue ImportDriveResourcesError
        @logger.fatal("Failed to import resources for #{@project.title} [#{@project.id}]")
      end
    end

    private

    def pre_import_validation
      validate_spreadsheet
      validate_resources_sheet
      validate_collections_sheet
    end

    def import_collection(row)
      @logger.info "Importing collection: \"#{row[:title]}\""
      collection = find_or_initialize_collection(fingerprint(row))
      update_simple_attributes(collection, row, COLLECTION_SIMPLE_ATTRIBUTES)
      update_boolean_attributes(collection, row, COLLECTION_BOOLEAN_ATTRIBUTES)
      update_attachment_attributes(collection, row, COLLECTION_ATTACHMENT_ATTRIBUTES)
      return collection.save if collection.valid?
      @logger.log_model_errors(collection)
    end

    def import_resource(row, count)
      @logger.info "Importing row: \"#{row[:title]}\""
      resource = find_or_initialize_resource(fingerprint(row))
      resource.creator = @creator
      update_simple_attributes(resource, row, RESOURCE_SIMPLE_ATTRIBUTES)
      update_boolean_attributes(resource, row, RESOURCE_BOOLEAN_ATTRIBUTES)
      update_attachment_attributes(resource, row, RESOURCE_ATTACHMENT_ATTRIBUTES)
      create_tag_list(resource, row)
      if resource.valid?
        resource.save
        add_resource_to_collection(resource, row[:collection], count)
        return
      end
      @logger.log_model_errors(resource)
    end

    def create_tag_list(resource, row)
      return unless row["keywords"]
      resource.tag_list.add(row["keywords"], parse: true)
    end

    def add_resource_to_collection(resource, collection_title, count)
      return if collection_title.blank?
      @logger.info "    Attempting to add resource to collection \"#{collection_title}\""
      collection = @project.collections.find_by(title: collection_title)
      return @logger.log_missing_collection unless collection
      return @logger.log_already_in_collection if
        resource.collections.include?(collection)
      remove_resource_from_all_collections(resource)
      @logger.info "        Resource does not belong to collection. Adding."
      create_collection_resource(collection, resource, count)
    end

    def remove_resource_from_all_collections(resource)
      resource.collection_resources.each do |cr|
        @logger.info "        Remove resource from collection: #{cr.title}"
        cr.destroy
      end
    end

    def create_collection_resource(collection, resource, position)
      cr = CollectionResource.create(
        collection: collection,
        resource: resource,
        position: position
      )
      return @logger.log_model_errors(cr) unless cr.valid?
      cr
    end

    def update_simple_attributes(model, row, simple_attributes)
      attr = simple_attributes_from_row(row, simple_attributes)
      model.update_attributes(attr)
    end

    def update_attachment_attributes(model, row, attachment_attributes)
      attachment_attributes.each do |attr|
        begin
          import_model_attachment(model, attr, row[attr])
        rescue Google::Apis::TransmissionError
          @logger.warn "    Caught Google::Apis::TransmissinoError. Trying again"
          import_model_attachment(model, attr, row[attr])
        end
      end
    end

    def update_boolean_attributes(model, row, boolean_attributes)
      boolean_attributes.each do |boolean_attr|
        value = TRUTHY_VALUES.include?(row[boolean_attr]) ? true : false
        model.send("#{boolean_attr}=", value)
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
      tmp_path = model.send(key.to_s).queued_for_write[:original].path
      Digest::MD5.hexdigest(File.read(tmp_path))
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
      @logger.log_missing_file
      false
    end

    def already_downloaded?(file, model, key)
      return false if file.md5_checksum != model.send("#{key}_checksum")
      @logger.log_unchanged_file(file)
      true
    end

    def simple_attributes_from_row(row, attr_list)
      row.select do |col, _val|
        attr_list.include?(col)
      end
    end

    def fingerprint(row)
      candidates = %w(local_id attachment external_url title)
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
        (REQUIRED_RESOURCE_COLUMNS - resources_sheet.list.keys).blank?
    end

    def validate_spreadsheet
      raise_missing_spreadsheet_error if spreadsheet.nil?
    end

    def validate_collections_sheet
      raise_missing_sheet_error("collections") if collections_sheet.nil?
      raise_missing_column_error(collections_sheet) unless
        (REQUIRED_COLLECTION_COLUMNS - collections_sheet.list.keys).blank?
    end

    def find_or_initialize_resource(fingerprint)
      resource = @project.resources.find_or_initialize_by fingerprint: fingerprint
      # rubocop:disable LineLength
      @logger.info "    Found existing resource with id #{resource.id}" unless resource.new_record?
      @logger.info "    No resource exists for fingerprint. Creating new resource" if resource.new_record?
      # rubocop:enable LineLength
      resource
    end

    def find_or_initialize_collection(fingerprint)
      collection = @project.collections.find_or_initialize_by fingerprint: fingerprint
      # rubocop:disable LineLength
      @logger.info "    Found existing collection with id #{collection.id}" unless collection.new_record?
      @logger.info "    No collection exists for fingerprint. Creating new collection" if collection.new_record?
      # rubocop:enable LineLength
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

    def raise_missing_column_error(ws)
      # rubocop:disable LineLength
      msg = "\"#{ws.title}\" sheet in \"#{ws.spreadsheet.title}\" is missing required column(s): #{(REQUIRED_RESOURCE_COLUMNS - ws.list.keys).join(', ')}"
      # rubocop:enable LineLength
      @logger.error(Rainbow(msg).red)
      raise ImportDriveResourcesError
    end

    def raise_attachment_save_error
      msg = "Saved attachment checksum does not match checksum reported by Google Drive."
      @logger.error(Rainbow(msg).red)
      raise ImportDriveResourcesError
    end

    def drive_folder
      @collection ||= session.file_by_id(@drive_folder_id)
    end

    def spreadsheet
      @spreadsheet ||= session.spreadsheet_by_key(@sheet_id)
    end

    def resources_sheet
      @resources_sheet ||= spreadsheet.worksheet_by_title("resources")
    end

    def collections_sheet
      @collections_sheet ||= spreadsheet.worksheet_by_title("collections")
    end

    def session
      @session ||= ::Factory::DriveSession.create_service_account_session
    end
  end
  # rubocop:enable ClassLength
end
