class CreateUserTagPrefs < ActiveRecord::Migration[8.0]
  def change
    create_table :user_tag_prefs do |t|
      t.references :user, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true
      t.integer :weight

      t.timestamps
    end
    add_index :user_tag_prefs, [ :user_id, :tag_id ], unique: true  # ←これを追加
  end
end
