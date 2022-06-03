Dry::Rails.container do
  configure do |config|
    config.component_dirs.add "app/operations"
  end
end
