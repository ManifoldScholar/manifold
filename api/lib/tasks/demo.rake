namespace :demo do

  desc "Loads demo data into Manifold"
  task load: :environment do
    Demonstration::DataLoader.new.load
  end

  desc "Loads one text into Manifold and creates a corresponding project"
  task :load_text, [:path, :log_level] => :environment do |_t, args|
    Demonstration::DataLoader.new.load_text(args.path, args.log_level)
  end

  desc "Ensure that every project has a published text"
  task publish_project_texts: :environment do
    Demonstration::DataLoader.new.publish_project_texts
  end

end
