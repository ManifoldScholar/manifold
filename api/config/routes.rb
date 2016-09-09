Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do

      resources :pages
      resources :texts
      resources :text_sections, only: [:show] do
        resources :annotations, shallow: true
      end
      resources :projects
      resources :tokens, only: [:create]

      resources :users, only: [:create, :show] do
        collection do
          get "whoami"
        end
      end

      namespace :configuration do
        resource :client, only: [:show], controller: "client"
      end

      resource :me, only: [:show, :update], controller: "me"
      namespace :me do
        namespace :relationships do
          resources :favorites
        end
      end
    end
  end
end
