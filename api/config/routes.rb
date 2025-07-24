# frozen_string_literal: true

require "sidekiq/web"
require "zhong/web"

Rails.application.routes.draw do
  concern :flaggable do
    resource :flags, controller: "/api/v1/flags", only: [:create, :destroy] do
      member do
        delete :resolve_all
      end
    end
  end

  concern :permissible do
    resources :permissions,
              only: [:create, :index, :show, :update, :destroy],
              controller: "/api/v1/permissions"
  end

  constraints ->(request) { AuthConstraint.new(request).admin? || Rails.env.development? } do
    mount Sidekiq::Web => "/api/sidekiq"
    mount Zhong::Web, at: "/api/zhong"
  end

  get "auth/:provider/callback", to: "oauth#authorize"

  namespace :api do
    mount ManifoldOAI::RackWrapper => "/oai", as: :oai
    mount Tus::Server => "/files"

    namespace :proxy do
      resources :ingestion_sources, only: [:show]
    end

    namespace :v1 do
      concern :collected_models do
        resources :projects, only: [:index]
        resources :journal_issues, only: [:index]
        resources :resources, only: [:index]
        resources :resource_collections, only: [:index]
        resources :texts, only: [:index]
        resources :text_sections, only: %[index]
      end

      scope as: :bulk_delete, controller: :bulk_deletions, path: "bulk_delete" do
        delete :annotations
        delete :comments
        delete :reading_groups
        delete :users
      end

      resources :action_callouts, only: [:show, :update, :destroy]
      resources :contacts, only: [:create]
      resources :content_blocks, only: [:show, :update, :destroy]
      resources :email_confirmations, only: %i[show update]
      resources :test_mails, only: [:create]
      resources :pages

      resources :reading_group_kinds

      resources :reading_group_memberships, only: [:show, :create, :update, :destroy] do
        member do
          post :activate
          post :archive
        end
      end

      resources :public_reading_groups, only: %i[index]

      resources :reading_groups do
        collection do
          get "lookup"
        end

        member do
          post :clone, action: :do_clone

          post :join
        end

        scope module: :reading_groups do
          namespace :relationships do
            resources :annotations, only: [:index]
            resources :reading_group_categories, only: %i[index show create update destroy]
            resources :reading_group_memberships, only: [:index]

            concerns :collected_models
          end
        end
      end

      resources :operations, only: %i[create]

      resources :entitlements, only: %i[index show create destroy]
      resources :entitlement_imports, only: %i[index show create destroy]
      resources :pending_entitlements, only: %i[index show create destroy]
      resources :entitlement_targets, only: %i[index]
      resources :export_targets
      resources :project_exportations, except: [:update]
      resources :features
      resources :subjects
      resources :categories, except: [:create, :index]
      resources :makers
      resources :ingestions, only: [:show, :update] do
        member do
          post "reset"
          post "process", action: :do_process
          post "reingest"
        end

        scope module: :ingestions do
          namespace :relationships do
            resources :ingestion_messages, only: [:index]
          end
        end
      end
      resources :stylesheets, only: [:show, :update, :destroy]
      resources :tags, only: [:index]
      resources :events, only: [:destroy]
      resources :search_results, only: [:index]
      resource :statistics, only: [:show]
      resource :settings, except: [:destroy, :create]
      resources :journal_issues, except: [:create]
      resources :journal_volumes, except: [:create, :index]
      resources :ingestion_sources, except: [:create, :index]
      resources :annotations, only: [:index, :show, :destroy]
      resources :collaborators do
        collection do
          get :roles
        end
      end

      resources :texts do
        put :toggle_export_epub_v3, on: :member, path: "export_epub_v3"

        scope module: :texts do
          resources :ingestions, only: [:create]

          namespace :relationships do
            resources :text_sections, only: [:index, :create, :show]
            resources :stylesheets, only: [:create], controller: "/api/v1/stylesheets"
            resources :ingestions, only: [:create], controller: "/api/v1/texts/relationships/text_section_ingestions"
            resources :ingestion_sources, only: [:index, :create]
            resources :collaborators, only: [:index, :show] do
              collection do
                post :create_from_roles
                post :update_from_roles
                delete :destroy
              end
            end

            resources :text_sections do
              scope module: :text_sections do
                resources :annotations, only: [:index]
                resources :resources, only: [:index]
                resources :resource_collections, only: [:index]
              end
            end
          end
        end
      end

      resources :comments, only: [:index, :show, :update, :destroy] do
        namespace :relationships do
          concerns :flaggable
        end
      end

      resources :annotations, only: [:update], controller: "text_sections/relationships/annotations" do
        namespace :relationships do
          concerns :flaggable
          resources :comments, controller: "/api/v1/comments"
        end
      end

      resources :resources, only: [:show, :update, :destroy] do
        scope module: :resources do
          namespace :relationships do
            resources :comments, controller: "/api/v1/comments"
            resources :text_tracks
            resources :annotations, only: [:index]
          end
        end
      end

      resources :resource_collections, only: [:show, :update, :destroy] do
        scope module: :resource_collections do
          namespace :relationships do
            resources :collection_resources, only: [:index, :show]
            resources :resources, only: [:index]
            resources :annotations, only: [:index]
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

      resources :text_sections, only: [:update, :destroy] do
        scope module: :text_sections do
          namespace :relationships do
            resources :annotations, only: [:create, :update]
          end
        end
      end

      resources :journals do
        scope module: :journals do
          namespace :relationships do
            resources :action_callouts, only: [:index, :create]
            resources :entitlements, only: [:index, :create]
            resources :journal_issues, only: [:index, :create]
            resources :journal_volumes, only: [:index, :create]
            concerns [:permissible]
          end
        end
      end

      resources :projects do
        scope module: :projects do
          resources :ingestions, only: [:create]

          namespace :relationships do
            resources :action_callouts, only: [:index, :create]
            resources :entitlements, only: [:index, :create]
            resources :project_exportations, only: [:index]
            resources :content_blocks, only: [:index, :create]
            resources :uncollected_resources, only: [:index]
            resources :resources, only: [:index, :create]
            resources :resource_collections, only: [:index, :create]
            resources :events, only: [:index]
            resources :resource_imports, only: [:create, :update, :show]
            resources :collaborators, only: [:index, :show] do
              collection do
                post :create_from_roles
                post :update_from_roles
                delete :destroy
              end
            end
            resources :text_categories, only: [:index, :create, :show]
            resources :texts, only: [:create]
            resources :ingestions, only: [:create], controller: "/api/v1/ingestions"
            resources :versions, only: [:index]
            concerns [:permissible]
          end
        end
      end

      resources :tokens, only: [:create]

      resources :users do
        collection do
          get "whoami"
        end

        scope module: :users do
          namespace :relationships do
            resources :annotations, only: [:index]
            resources :reading_group_memberships, only: [:index]
          end
        end
      end

      resource :me, only: [:show, :update, :destroy], controller: "me"
      namespace :me do
        namespace :relationships do
          resources :annotated_texts, only: %i[index]
          resources :favorites, except: [:update]
          resources :reading_groups, only: [:index]
          resources :favorite_projects, only: [:index]
          resources :annotations, only: [:index]

          resource :collection, only: %i[show]

          concerns :collected_models
        end
      end

      namespace :notification_preferences do
        namespace :relationships do
          resource :unsubscribe, controller: "unsubscribe", only: [:create]
        end
      end

      namespace :analytics do
        resource :events, only: [:create]
        resource :reports, only: [:show]
      end

      resources :passwords, only: [:create, :update]
      post "passwords/admin_reset_password" => "passwords#admin_reset_password"

      get "ping", to: "status#ping", via: %i[get head]

      get "*path", to: "errors#error_404", via: :all
    end
  end
end
