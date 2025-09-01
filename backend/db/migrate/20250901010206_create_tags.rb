class CreateTags < ActiveRecord::Migration[8.0]
  def change
    create_table :tags, id: :uuid do |t|
      t.string :slug, null: false
      t.string :label, null: false
      t.timestamp :created_at, null: false, default: -> {"CURRENT_TIMESTAMP"}
      
    end
    add_index :tags, :slug, unique: true
  end
end
