class EnablePgCryptoExtension < ActiveRecord::Migration[5.2]

  def up
    enable_extension("pgcrypto") unless extensions.include?("pgcrypto")
  end

  def down
    disable_extension("pgcrypto") if extensions.include?("pgcrypto")
  end

end
