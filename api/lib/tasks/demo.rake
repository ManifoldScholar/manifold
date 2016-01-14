namespace :demo do
  desc "Loads demo data into Manifold"
  task load: :environment do
    Demonstration::DataLoader.new.load
  end
end
