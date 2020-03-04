module Manifold
  module UserTask
    def self.create_user(args)
      attributes = args.to_hash
      attributes[:password_confirmation] = attributes[:password]
      User.create(attributes)
    end

    def self.user_args
      [:email, :password, :first_name, :last_name, :role]
    end
  end
end

namespace :manifold do
  namespace :user do
    desc "Create a new manifold user"
    task :create, Manifold::UserTask.user_args => :environment do |_t, args|
      Manifold::Rake.report_created_model(Manifold::UserTask.create_user(args))
    end

    namespace :create do
      desc "Create a new manifold admin user"
      task :admin, Manifold::UserTask.user_args => :environment do |_t, args|
        attributes = args.to_hash
        attributes[:role] = :admin
        Manifold::Rake.report_created_model(Manifold::UserTask.create_user(attributes))
      end
    end
  end
end
