require "sidekiq/web"

# rubocop:disable Metrics/BlockLength, Metrics/LineLength
Rails.application.routes.draw do
  if Rails.env.development?
    mount Rswag::Ui::Engine => "/api-docs"
    mount Rswag::Api::Engine => "/api-docs"
  end

  concern :permissible do
    resources :permissions,
              only: [:create, :index, :show, :update, :destroy],
              controller: "/api/v1/permissions"
  end

  mount Sidekiq::Web => "/sidekiq" if Rails.env.development?

  get "auth/:provider/callback", to: "oauth#authorize"

  namespace :api do
    mount Tus::Server => "/files"

    namespace :proxy do
      resources :ingestion_sources, only: [:show]
    end

    namespace :v1 do
      resources :action_callouts, only: [:show, :update, :destroy]
      resources :contacts, only: [:create]
      resources :content_blocks, only: [:show, :update, :destroy]
      resources :test_mails, only: [:create]
      resources :pages

      resources :reading_group_memberships, only: [:destroy, :create]
      resources :reading_groups do
        collection do
          get "lookup"
        end
        scope module: :reading_groups do
          namespace :relationships do
            resources :reading_group_memberships, only: [:index]
            resources :annotations, only: [:index]
          end
        end
      end

      resources :features
      resources :subjects
      resources :categories, except: [:create, :index]
      resources :makers
      resources :ingestions, only: [:show, :update]
      resources :stylesheets, only: [:show, :update, :destroy]
      resources :tags, only: [:index]
      resources :events, only: [:destroy]
      resources :search_results, only: [:index]
      resource :statistics, only: [:show]
      resource :settings, except: [:destroy, :create]

      resources :texts do
        scope module: :texts do
          namespace :relationships do
            resources :text_sections, only: [:index]
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
          resource :flags, controller: "/api/v1/flags", only: [:create, :destroy]
          resources :comments, controller: "/api/v1/comments"
        end
      end

      resources :resources do
        namespace :relationships do
          resources :comments, controller: "/api/v1/comments"
        end
      end

      resources :resource_collections do
        scope module: :resource_collections do
          namespace :relationships do
            resources :collection_resources, only: [:index, :show]
            resources :resources, only: [:index]
          end
        end
      end

      resources :project_collections do
        scope module: :project_collections do
          namespace :relationships do
            resources :collection_projects, only: [:index, :show, :update]
            resources :projects, only: [:index]
          end
        end
      end

      resources :text_sections, only: [:show] do
        scope module: :text_sections do
          namespace :relationships do
            resources :annotations, only: [:index, :create, :update]
            resources :resources, only: [:index, :create, :update]
            resources :resource_collections, only: [:index, :create, :update]
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
            resources :action_callouts, only: [:index, :create]
            resources :content_blocks, only: [:index, :create]
            resources :uncollected_resources, only: [:index]
            resources :resources, only: [:index, :create]
            resources :resource_collections, only: [:index, :create]
            resources :events, only: [:index]
            resources :twitter_queries, only: [:index, :create]
            resources :resource_imports, only: [:create, :update, :show]
            resources :collaborators
            resources :text_categories, only: [:index, :create, :show]
            resources :ingestions, only: [:create], controller: "/api/v1/ingestions"
            resources :versions, only: [:index]
            concerns [:permissible]
          end
        end
      end

      resources :twitter_queries, only: [:show, :update, :destroy], controller: "projects/relationships/twitter_queries" do
        scope module: :twitter_queries do
          namespace :relationships do
            resource :fetch, controller: "twitter_query_fetch", only: [:create]
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
          resources :reading_groups, only: [:index]
          resources :favorite_projects, only: [:index]
          resources :annotations, only: [:index]
        end
      end

      namespace :notification_preferences do
        namespace :relationships do
          resource :unsubscribe, controller: "unsubscribe", only: [:create]
        end
      end

      resources :passwords, only: [:create, :update]
      post "passwords/admin_reset_password" => "passwords#admin_reset_password"

      get "*path", to: "errors#error_404", via: :all
    end
  end
end
# rubocop:enable Metrics/BlockLength, Metrics/LineLength
