require "sidekiq/web"
require "zhong/web"

# rubocop:disable Metrics/BlockLength
Rails.application.routes.draw do
  concern :permissible do
    resources :permissions,
              only: [:create, :index, :show, :update, :destroy],
              controller: "/api/v1/permissions"
  end

  constraints ->(request) { AuthConstraint.new(request).admin? } do
    mount Sidekiq::Web => "/api/sidekiq"
    mount Zhong::Web, at: "/api/zhong"
  end

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

      resources :entitlements, only: %i[index show create destroy]
      resources :entitlement_targets, only: %i[index]
      resources :export_targets
      resources :project_exportations, only: [:index, :show, :create]
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
        put :toggle_export_epub_v3, on: :member, path: "export_epub_v3"

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

      resources :annotations, only: [:update, :destroy], controller: "text_sections/relationships/annotations" do
        namespace :relationships do
          resource :flags, controller: "/api/v1/flags", only: [:create, :destroy]
          resources :comments, controller: "/api/v1/comments"
        end
      end

      resources :resources, only: [:show, :update, :destroy] do
        namespace :relationships do
          resources :comments, controller: "/api/v1/comments"
        end
      end

      resources :resource_collections, only: [:show, :update, :destroy] do
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
            resources :collection_projects, except: [:show]
            resources :projects, only: [:index]
          end
        end
      end

      resources :text_sections, only: [:show] do
        scope module: :text_sections do
          namespace :relationships do
            resources :annotations, only: [:index, :create, :update]
            resources :resources, only: [:index]
            resources :resource_collections, only: [:index]
          end
        end
      end

      resources :projects do
        scope module: :projects do
          namespace :relationships do
            resources :action_callouts, only: [:index, :create]
            resources :entitlements, only: [:index, :create]
            resources :project_exportations, only: [:index]
            resources :content_blocks, only: [:index, :create]
            resources :uncollected_resources, only: [:index]
            resources :resources, only: [:index, :create]
            resources :resource_collections, only: [:index, :create]
            resources :events, only: [:index]
            resources :twitter_queries, only: [:index, :create]
            resources :resource_imports, only: [:create, :update, :show]
            resources :collaborators, only: [:index, :show]
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
          resources :favorites, except: [:update]
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
# rubocop:enable Metrics/BlockLength
