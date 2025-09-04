class User < ApplicationRecord
  has_many :refresh_tokens, dependent: :destroy
  has_many :user_tag_prefs, dependent: :destroy
  has_many :tags, through: :user_tag_prefs

  before_validation :normalize_fields

  validates :uid,      uniqueness: { scope: :provider }
  validates :username, uniqueness: { case_sensitive: false }

  validates :avatar_url,
            allow_blank: true,
            format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]),
                      message: "正しいURLを入力してください" }

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.username = auth.info.nickname
      user.name = auth.info.name
      user.avatar_url = auth.info.image
    end
  end

  def generate_tokens
    access_token = JwtService.encode({ user_id: id })
    refresh_token_string = JwtService.generate_refresh_token

    refresh_tokens.create!(
      token: refresh_token_string,
      expires_at: 30.days.from_now
    )

    { access_token: access_token, refresh_token: refresh_token_string }
  end

  def invalidate_all_tokens!
    refresh_tokens.destroy_all
  end

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
