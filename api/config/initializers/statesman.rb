# config/initializers/statesman.rb
Statesman.configure do
  storage_adapter(Statesman::Adapters::ActiveRecord)
end
