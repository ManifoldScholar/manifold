# frozen_string_literal: true

module StandardEbooks
  class Populate
    def initialize(username:, logger:, count: nil, title: nil)
      @count = count
      @title = title
      @username = username
      @logger = logger
    end

    def call
      user = Manifold::Rake.cli_user

      @logger.info "Fetching Standard Ebooks OPDS catalog..."
      entries = FetchCatalog.new(username: @username).call
      @logger.info "Found #{entries.count} entries in catalog"

      selected = if @title
                   find_by_title(entries)
                 else
                   select_random(entries)
                 end

      return if selected.empty?

      imported = 0
      selected.each_with_index do |entry, index|
        @logger.info "Importing book #{index + 1} of #{selected.count}: #{entry[:title]}"
        import_book(entry, user)
        imported += 1
      rescue StandardError => e
        @logger.error "Failed to import \"#{entry[:title]}\": #{e.message}"
        @logger.error e.backtrace.first(5).join("\n")
      end

      @logger.info "Import complete. Successfully imported #{imported} of #{selected.count} books."
    end

    private

    def find_by_title(entries)
      match = entries.find { |e| e[:title].downcase == @title.downcase }
      unless match
        @logger.error "No entry found matching title \"#{@title}\""
        return []
      end

      if Project.exists?(["LOWER(title) = ?", match[:title].downcase])
        @logger.warn "Project \"#{match[:title]}\" already exists, importing anyway"
      end

      [match]
    end

    def select_random(entries)
      entries = filter_existing(entries)
      @logger.info "#{entries.count} entries remain after filtering existing projects"

      selected = entries.sample(@count)
      @logger.info "Selected #{selected.count} entries for import"
      selected
    end

    def filter_existing(entries)
      existing_titles = Project.pluck(:title).to_set(&:downcase)
      entries.reject { |entry| existing_titles.include?(entry[:title].downcase) }
    end

    def import_book(entry, user)
      ImportBook.new(
        entry: entry,
        user: user,
        logger: @logger,
        username: @username
      ).call
    end
  end
end
