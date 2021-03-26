module Importer
  # This class imports a project.json file into Manifold
  class Project
    def initialize(path, creator, logger = Rails.logger)
      @creator = creator
      @logger = logger
      @path = path
      @project_json = read_json("project.json")
    rescue StandardError => e
      @logger.error "Unable to import project at #{@path}"
      @logger.error(e)
    end

    def import(include_texts: true)
      ApplicationRecord.transaction { upsert_project(include_texts) } if @project_json
    rescue StandardError => e
      @logger.error "Unable to import project at #{@path}"
      @logger.error(e)
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
      if @project_json[:attributes][:hashtag]
        ::Project.find_or_initialize_by(
          hashtag: @project_json[:attributes][:hashtag]
        )
      elsif @project_json[:attributes][:title]
        ::Project.find_or_initialize_by(
          title: @project_json[:attributes][:title]
        )
      else
        ::Project.new(draft: false)
      end
    end

    # rubocop:disable all
    def upsert_project(include_texts)
      project = find_project
      project.draft = false
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
      unset_untouched(project, @project_json[:attributes], excludes)
      raise "Invalid project: #{project.errors.full_messages}" unless project.valid?
      project.save
      create_twitter_queries(project)
      import_collaborators(project)
      import_subject(project)
      import_texts(project, @project_json[:published_text], published: true) if include_texts
      import_texts(project, @project_json[:texts]) if include_texts
      import_resources(project)
      scaffold_content(project)
    end
    # rubocop:enable all

    def import_resources(project)
      drive_sheet = @project_json[:resource_drive_sheet]
      drive_dir = @project_json[:resource_drive_dir]
      return unless !drive_sheet.blank? && !drive_dir.blank?

      importer = Importer::DriveResources.new(project.id, drive_sheet, drive_dir,
                                              @creator, @logger)
      importer.import
    rescue StandardError => e
      @logger.error "Unable to import resources for #{project.title}"
      @logger.error(e)
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
      maker = Maker.find_or_create_by(Maker.parse_name(maker_attr[:name]))
      maker.update(maker_attr)
      set_attachment(maker, :avatar, maker_json[:avatar])
      maker.save
      project.collaborators.find_or_create_by(
        maker_id: maker.id,
        role: role
      )
    end

    def import_text(project, path)
      ingestion = Ingestions::CreateManually.run(project: project,
                                                 source: File.open(path),
                                                 creator: @creator).result

      @logger.info "  Importing project text at #{path}"
      outcome = Ingestions::Ingestor.run ingestion: ingestion,
                                         logger: @logger
      outcome.result if outcome.valid?
    end

    def import_texts(project, texts, **attrs)
      return unless texts

      texts = texts.is_a?(Array) ? texts : [texts]
      texts.each do |text_file_name|
        text_path = "#{@path}/texts/#{text_file_name}"
        text = import_text(project, text_path)
        if text.present?
          text.update attrs if attrs.present?
          @logger.info "Created #{'published ' if text.published?}text #{text.title}"
        else
          @logger.error "Unable to import project text at #{text_path}"
        end
      end
    end

    def scaffold_content(project)
      @logger.info "  Creating project content blocks"
      Content::ScaffoldProjectContent.run project: project,
                                          kind: "default"
    end

    def create_twitter_queries(project)
      twitter_queries = @project_json[:twitter_queries]
      return unless twitter_queries.present?

      @logger.info "  Creating project twitter queries"
      twitter_queries.each do |query|
        TwitterQuery.create(project: project, query: query, creator: @creator)
      end
    end

    def unset_untouched(model, attributes, exclude = [])
      default_excludes = %w(id created_at updated_at creator_id draft dark_mode standalone_mode restricted_access open_access fa_cache)
      exclude.concat(default_excludes)
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
        model.send("#{key}=", nil)
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
end
