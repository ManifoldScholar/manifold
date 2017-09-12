namespace :manifold do
  namespace :dev do
    desc "Loads demo data into Manifold"
    task seed: :environment do
      Manifold::Rake.logger.info "Seeding development environment data"
      Demonstration::DataLoader.new.load
    end

    desc "Loads one text into Manifold and creates a corresponding project"
    task :load_text, [:path, :log_level] => :environment do |_t, args|
      Manifold::Rake.logger.info "Loading one text and creating dummy project"
      Demonstration::DataLoader.new.load_text(args.path, args.log_level)
    end

    desc "Ensure that every project has a published text"
    task publish_project_texts: :environment do
      Manifold::Rake.logger.info "Ensuring that all projects have a published text"
      Demonstration::DataLoader.new.publish_project_texts
    end
  end
end
