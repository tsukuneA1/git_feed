class CreateGithubEvents < ActiveRecord::Migration[8.0]
  def up
    create_table :github_events, if_not_exists: true do |t|
      t.string :remote_event_id
      t.string :event_type
      t.datetime :event_time
      t.datetime :fetched_at
      t.integer :actor_remote_id
      t.integer :repo_remote_id
      t.string :language_slug
      t.uuid :language_id
      t.jsonb :payload

      t.timestamps
    end
  end

  def down
    drop_table :github_events, if_exists: true
  end
end
