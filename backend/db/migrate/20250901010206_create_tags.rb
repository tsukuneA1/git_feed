class CreateTags < ActiveRecord::Migration[8.0]
  def change
    create_table :tags, id: :uuid do |t|
      t.string :slug, null: false
      t.string :label, null: false
      t.timestamps created_at: true, updated_at: false
    end
    add_index :tags, :slug, unique: true
  end
end
