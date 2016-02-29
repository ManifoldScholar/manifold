namespace :demo do
  desc "Loads demo data into Manifold"
  task load: :environment do
    Demonstration::DataLoader.new.load
  end

  desc "Ensure that every project has a published text"
  task publish_project_texts: :environment do
    Demonstration::DataLoader.new.publish_project_texts
  end


end
