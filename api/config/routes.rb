require "sidekiq/web"

Rails.application.routes.draw do
  mount Sidekiq::Web => "/sidekiq"
  namespace :api do
    namespace :v1 do
      resources :pages
      resources :texts
      resources :text_sections, only: [:show] do
        resources :annotations, shallow: true
      end
      resources :projects do
        resources :events, only: [:index]
      end
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
