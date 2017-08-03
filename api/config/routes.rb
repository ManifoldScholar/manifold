require "sidekiq/web"

# rubocop:disable Metrics/BlockLength, Metrics/LineLength
Rails.application.routes.draw do
  mount Sidekiq::Web => "/sidekiq" if Rails.env.development?

  get "auth/:provider/callback", to: "oauth#authorize"

  namespace :api do
    namespace :v1 do
      resources :test_mails, only: [:create]
      resources :pages
      resources :subjects
      resources :categories, except: [:create, :index]
      resources :makers
      resources :ingestions, only: [:show, :update]
      resources :stylesheets, only: [:show, :update, :destroy]
      resources :events, only: [:destroy]
      resource :statistics, only: [:show]
      resource :settings, except: [:destroy, :create]

      resources :texts do
        scope module: :texts do
          namespace :relationships do
            resources :stylesheets, only: [:create], controller: "/api/v1/stylesheets"
          end
        end
      end

      resources :comments, only: [:show, :update, :destroy] do
        namespace :relationships do
          resource :flags, controller: "/api/v1/flags", only: [:create, :destroy]
        end
      end

      resources :annotations, only: [:show, :update, :destroy], controller: "text_sections/relationships/annotations" do
        namespace :relationships do
          resources :comments, controller: "/api/v1/comments"
        end
      end

      resources :resources do
        namespace :relationships do
          resources :comments, controller: "/api/v1/comments"
        end
      end

      resources :collections do
        scope module: :collections do
          namespace :relationships do
            resources :collection_resources, only: [:index, :show]
            resources :resources, only: [:index]
          end
        end
      end

      resources :text_sections, only: [:show] do
        scope module: :text_sections do
          namespace :relationships do
            resources :annotations, only: [:index, :create, :update]
            resources :resources, only: [:index, :create, :update]
          end
        end
      end

      # TODO: Implement
      resources :collaborators, only: [:show]
      resources :collection_resources, only: [:show]
      # END TODO

      resources :projects do
        scope module: :projects do
          namespace :relationships do
            resources :uncollected_resources, only: [:index]
            resources :resources, only: [:index, :create]
            resources :collections, only: [:index, :create]
            resources :events, only: [:index]
            resources :collaborators
            resources :text_categories, only: [:index, :create]
            resources :ingestions, only: [:create], controller: "/api/v1/ingestions"
          end
        end
      end

      resources :tokens, only: [:create]

      resources :users do
        collection do
          get "whoami"
        end
      end

      resource :me, only: [:show, :update], controller: "me"
      namespace :me do
        namespace :relationships do
          resources :favorites
          resources :favorite_projects, only: [:index]
          resources :annotations, only: [:index]
        end
      end

      resources :passwords, only: [:create, :update]
      post "passwords/admin_reset_password" => "passwords#admin_reset_password"

      get "*path", to: "errors#error_404", via: :all
    end
  end
end
# rubocop:enable Metrics/BlockLength, Metrics/LineLength
