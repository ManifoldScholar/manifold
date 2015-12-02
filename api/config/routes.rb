Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :texts
      resources :projects
      resources :tokens, only: [:create]
      resources :users, only: [] do
        collection do
          get "whoami"
        end
      end
      get "development/whoami", to: "development#whoami"
    end
  end
end
