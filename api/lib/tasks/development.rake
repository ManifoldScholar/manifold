namespace :manifold do
  namespace :development do
    desc "Loads demo data into Manifold"
    task seed: :environment do
      Manifold::Rake.logger.info "Seeding development environment data"
      Demonstration::DataLoader.new.load
    end
  end
end
