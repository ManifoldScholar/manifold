require "faker"
require "open-uri"
# rubocop:disable Metrics/ClassLength
module Demonstration
  # Loads demo data into the Manifold installation
  class DataLoader

    def initialize
      @logger = Logger.new(STDOUT)
      @logger.formatter = proc { |severity, _datetime, _progname, msg|
        "#{severity.rjust(8)}: #{msg}\n"
      }
    end

    def load
      clear_db
      seed_db
      create_admin_user
      # create_fake_users
      create_pages
      import_projects
      reindex_records
    end

    def import_projects
      cli_user = User.find_by(is_cli_user: true)
      children = Pathname.new("../import").children.select(&:directory?)
      children.each do |child|
        next if File.file?(File.join(child, ".skip"))
        Importer::Project.new(child, cli_user, @logger).import(true)
      end
    end

    def seed_db
      Seed.execute(@logger)
    end

    def clear_db
      clear = %w(Project Collaborator Maker Text TextSection IngestionSource Resource
                 Subject TextSubject TextTitle User Category Page UserClaim Annotation
                 CollectionResource Collection Comment Event Favorite Flag ProjectSubject
                 Stylesheet Subject)
      clear.each do |model_name|
        @logger.info("Truncate #{model_name} table".red)
        model_name.constantize.destroy_all
      end
    end

    def create_fake_users
      40.times do
        first_name = Faker::Name.first_name
        last_name = Faker::Name.last_name
        email = Faker::Internet.safe_email("#{first_name}_#{last_name}")
        u = User.find_or_create_by(email: email)
        u.role = "reader"
        u.first_name = first_name
        u.last_name = last_name
        u.password = "manifold"
        u.password_confirmation = "manifold"
        u.save
        @logger.info("Creating reader user: #{u.email}".green)
      end
    end

    def create_pages
      %w(about publishers terms).each do |title|
        page = Page.create(
          title: title.capitalize,
          nav_title: title.capitalize,
          body: "This is the #{title.capitalize} page"
        )
        @logger.info("Creating page: #{page.title}".green)
      end
    end

    # rubocop:disable Metrics/AbcSize
    def reindex_records
      Project.reindex
      @logger.info("Projects reindexed".green)
      User.reindex
      @logger.info("Users reindexed".green)
      Maker.reindex
      @logger.info("Makers reindexed".green)
      Resource.reindex
      @logger.info("Resources reindexed".green)
      Collection.reindex
      @logger.info("Collections reindexed".green)
      Event.reindex
      @logger.info("Events reindexed".green)
    end
    # rubocop:enable Metrics/AbcSize

    private

    def create_admin_user
      u = User.find_or_create_by(email: "admin@manifold.app")
      u.role = "admin"
      u.first_name = "Admin"
      u.last_name = "User"
      u.password = "manifold"
      u.password_confirmation = "manifold"
      u.save
      @logger.info("Creating admin user: #{u.email}".green)
    end
  end
end
