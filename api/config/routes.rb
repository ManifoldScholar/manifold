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

      resource :me, only: [:show], controller: "me"
      namespace :me do
        resources :favorites, only: [:index, :create, :show]
        namespace :favorites do
          resources :projects, only: [:index, :create, :destroy]
          resources :texts, only: [:index, :create, :destroy]
        end
      end
    end
  end

end
