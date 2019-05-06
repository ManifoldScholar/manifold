class CreateProjectCollectionSortOrders < ActiveRecord::Migration[5.1]
  def change
    create_view :project_collection_sort_orders, materialized: true

    add_index :project_collection_sort_orders, :sort_order, unique: true, name: "project_collection_sort_orders_pkey"
  end
end
