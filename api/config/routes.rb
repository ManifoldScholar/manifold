Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resource :me, only: [:show, :update]
      resources :texts
      resources :text_sections, only: [:show]
      resources :projects
      resources :tokens, only: [:create]
      resources :users, only: [:create, :show] do
        collection do
          get "whoami"
        end
      end
      get "development/whoami", to: "development#whoami"
    end
  end
end
