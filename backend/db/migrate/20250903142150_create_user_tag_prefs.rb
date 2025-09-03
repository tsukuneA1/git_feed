class CreateUserTagPrefs < ActiveRecord::Migration[8.0]
  def change
    create_table :user_tag_prefs do |t|
      t.references :user, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true
      t.integer :weight

      t.timestamps
    end
  end
end
