class User < ApplicationRecord
  before_validation :normalize_fields

  validates :uid,      uniqueness: { scope: :provider }
  validates :username, uniqueness: { case_sensitive: false }

  validates :avatar_url,
            allow_blank: true,
            format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]),
                      message: "正しいURLを入力してください" }

  def update_login_info(ip:, user_agent:)
    ua = user_agent.to_s[0, 255]
    update_columns(
      last_login_at: Time.current,
      last_login_ip: ip.presence,
      last_login_user_agent: ua,
      updated_at: Time.current
    )
  end

  private

  def normalize_fields
    self.provider   = normalize(provider, default: "github")
    self.uid        = normalize(uid)
    self.username   = normalize(username)
    self.avatar_url = normalize(avatar_url)
  end

  def normalize(value, default: nil)
    value.to_s.strip.downcase.presence || default
  end
end
