require "faker"
require "open-uri"
module Demonstration
  # Loads demo data into the Manifold installation
  class DataLoader

    def initialize
      @logger = Logger.new($stdout)
      @logger.formatter = proc { |severity, _datetime, _progname, msg|
        "#{severity.rjust(8)}: #{msg}\n"
      }
    end

    def load
      Searchkick.callbacks(false) do
        clear_db
        seed_db
        create_admin_user
        create_fake_users
        create_pages
        create_featured_projects_collection
        import_projects
      end
      reindex_records
    end

    private

    def info(msg)
      @logger.info(Rainbow(msg).lightblue)
    end

    def warn(msg)
      @logger.info(Rainbow(msg).yellow)
    end

    def cli_user
      @cli_user ||= User.cli_user
    end

    def import_projects
      children = Pathname.new("../import").children.select(&:directory?)
      children.each do |child|
        next if File.file?(File.join(child, ".skip"))

        Importer::Project.new(child, cli_user, @logger).import(include_texts: true)
      end
    end

    def seed_db
      Seed.execute(@logger)
    end

    def clear_db
      clear = %w(Project Collaborator Maker Text TextSection IngestionSource Resource
                 Subject TextSubject TextTitle User Category Page Annotation
                 ProjectCollection CollectionResource ResourceCollection Comment Event
                 Favorite Flag ProjectSubject Stylesheet Subject TwitterQuery
                 UpgradeResult)
      clear.each do |model_name|
        warn("Truncate #{model_name} table")
        model_name.constantize.destroy_all
      end
    end

    def create_fake_users
      40.times do
        first_name = Faker::Name.first_name
        last_name = Faker::Name.last_name
        email = Faker::Internet.email(name: "#{first_name}_#{last_name}")
        u = User.find_or_create_by(email: email)
        u.first_name = first_name
        u.last_name = last_name
        u.password = "manifold"
        u.password_confirmation = "manifold"
        u.save
        info("Creating reader user: #{u.email}")
      end
    end

    def create_pages
      %w(about publishers terms).each do |title|
        page = Page.create(
          title: title.capitalize,
          nav_title: title.capitalize,
          body: "This is the #{title.capitalize} page"
        )
        info("Creating page: #{page.title}")
      end
    end

    def create_featured_projects_collection
      project_collection = ProjectCollection.create(title: "Featured Projects",
                                                    featured_only: true,
                                                    visible: true,
                                                    number_of_projects: nil,
                                                    smart: true,
                                                    homepage: true,
                                                    icon: "lamp",
                                                    creator: cli_user)
      info("Creating project collection: #{project_collection.title}")
    end

    def reindex_records
      Project.reindex
      info("Projects reindexed")
      User.reindex
      info("Users reindexed")
      Maker.reindex
      info("Makers reindexed")
      Resource.reindex
      info("Resources reindexed")
      ResourceCollection.reindex
      info("ResourceCollections reindexed")
      Event.reindex
      info("Events reindexed")
    end

    def create_admin_user
      u = User.find_or_create_by(email: "admin@castironcoding.com")
      u.first_name = "Admin"
      u.last_name = "User"
      u.password = "Test123!"
      u.password_confirmation = "Test123!"
      u.role = :admin
      u.save
      info("Creating admin user: #{u.email}")
    end
  end
end
