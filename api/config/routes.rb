Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :texts
      resources :text_sections, only: [:show]
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
