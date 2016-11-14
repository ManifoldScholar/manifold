require "json"

module Importer
  # This class imports a project.json file into Manifold
  # rubocop:disable ClassLength
  class Project
    def initialize(path, creator, logger = Rails.logger)
      @creator = creator
      @logger = logger
      @path = path
      @project_json = read_json("project.json")
    end

    def import(include_texts = true)
      upsert_project(include_texts)
    end

    def resource_import_options
      {
        project_id: find_project.id,
        drive_sheet: @project_json[:resource_drive_sheet],
        drive_dir: @project_json[:resource_drive_dir]
      }
    end

    private

    def find_project
      ::Project.find_or_initialize_by(
        hashtag: @project_json[:attributes][:hashtag]
      )
    end

    # rubocop:disable all
    def upsert_project(include_texts)
      project = find_project
      if project.new_record?
        @logger.info "Creating new project: #{@project_json[:attributes][:title]}"
      else
        @logger.info "Updating existing project: #{@project_json[:attributes][:title]}"
      end
      project.creator = @creator if project.new_record?
      project.save if project.new_record?
      project.update(@project_json[:attributes])
      assign_project_attachments(project)
      excludes = %w(cover_ avatar_ hero_)
      excludes << "published_text_id" unless include_texts
      unset_untouched(project, @project_json[:attributes], excludes)
      raise "Invalid project: #{project.errors.full_messages}" unless project.valid?
      project.save
      import_collaborators(project)
      import_subject(project)
      import_published_text(project, @project_json[:published_text]) if include_texts
      import_resources(project)
    end
    # rubocop:enable all

    def import_resources(project)
      drive_sheet = @project_json[:resource_drive_sheet]
      drive_dir = @project_json[:resource_drive_dir]
      return unless !drive_sheet.blank? && !drive_dir.blank?
      @logger.info "  Importing resource"
      importer = Importer::DriveResources.new(project.id, drive_sheet, drive_dir,
                                              @creator, @logger)
      importer.import
    end

    def assign_project_attachments(project)
      @logger.info "  Updating project cover"
      set_attachment(project, :cover, @project_json[:cover])
      @logger.info "  Updating project hero"
      set_attachment(project, :hero, @project_json[:hero])
      @logger.info "  Updating project avatar"
      set_attachment(project, :avatar, @project_json[:avatar])
    end

    def import_subject(project)
      name = @project_json.dig(:relationships, :subject)
      return unless name
      @logger.info "  Importing project subject: #{name}"
      subject = Subject.find_or_create_by(name: name)
      project.subjects << subject unless project.subjects.include? subject
    end

    def import_collaborators(project)
      makers_json = @project_json.dig(:relationships, :makers)
      return unless makers_json
      touched_collaborator_ids = []
      makers_json.each do |maker_json|
        @logger.info "  Importing project maker: #{maker_json[:attributes][:name]}"
        collaborator = upsert_maker(maker_json, project)
        touched_collaborator_ids << collaborator.id
        project.collaborators.where.not(id: touched_collaborator_ids).destroy_all
      end
    end

    def upsert_maker(maker_json, project)
      maker_attr = maker_json[:attributes].clone
      role = maker_attr[:role]
      maker_attr.delete(:role)
      maker = Maker.find_or_create_by(
        name: maker_attr[:name]
      )
      maker.update(maker_attr)
      set_attachment(maker, :avatar, maker_json[:avatar])
      maker.save
      collaborator = project.collaborators.find_or_create_by(
        maker_id: maker.id,
        role: role
      )
      collaborator
    end

    def import_published_text(project, text_file_name)
      text_path = "#{@path}/texts/#{text_file_name}"
      @logger.info "  Importing project text at #{text_path}"
      Ingestor.logger = @logger
      text = Ingestor.ingest(text_path, @creator)
      Ingestor.reset_logger
      text.project = project
      project.published_text = text
      text.save
      project.save
    end

    def unset_untouched(model, attributes, exclude = [])
      exclude << "id"
      exclude << "created_at"
      exclude << "updated_at"
      exclude << "creator_id"
      fields = model.class.column_names.map(&:to_sym)
      touched = attributes.keys
      unset = (fields - touched).reject do |key|
        key.to_s.start_with?(*exclude)
      end
      unset.each do |key|
        model.send("#{key}=", nil)
      end
    end

    def set_attachment(model, key, value)
      if value.blank?
        model.send(key.to_s).clear
      else
        model.send("#{key}=", open_file(value))
      end
    end

    def open_file(file)
      File.open(path_for(file))
    end

    def read_file(file)
      File.read(path_for(file))
    end

    def path_for(file)
      "#{@path}/#{file}"
    end

    def read_json(file)
      JSON.parse(read_file(file)).deep_symbolize_keys
    end
  end
  # rubocop:enable ClassLength
end
