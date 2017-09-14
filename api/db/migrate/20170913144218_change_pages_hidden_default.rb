class ChangePagesHiddenDefault < ActiveRecord::Migration[5.0]
  def up
    change_column_default :pages, :hidden, true
  end

  def down
    change_column_default :pages, :hidden, false
    end
end
