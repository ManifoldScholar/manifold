Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :texts
      resources :projects
    end
  end
end
