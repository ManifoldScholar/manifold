namespace :create do
  desc "Creates an admin user"
  task :admin, [:email, :password] => :environment do |_t, args|
    u = User.create(
      first_name: "Admin",
      last_name: "User",
      role: "admin",
      email: args[:email],
      password: args[:password],
      password_confirmation: args[:password]
    )
    if u.valid?
      puts "Admin created! [ID: #{u.id}]"
    else
      puts u.errors.full_messages
    end
  end

end
