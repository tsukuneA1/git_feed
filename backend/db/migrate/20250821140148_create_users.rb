class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users, id: :uuid do |t|
      t.string :provider, null: false, default: "github"
      t.string :uid, null: false
      t.string :username, null: false
      t.string :name
      t.string :avatar_url

      t.datetime :last_login_at
      t.inet :last_login_ip
      t.string :last_login_user_agent

      t.timestamps null: false
    end

    add_index :users, [ :provider, :uid ], unique: true
    add_index :users, :username, unique: true
  end
end
