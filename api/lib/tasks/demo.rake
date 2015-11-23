namespace :demo do
  desc "Loads demo data into Manifold"
  task load: :environment do
    DemoData.new.load
  end
end
