class JwtService
  SECRET_KEY = ENV["JWT_SECRET_KEY"] || Rails.application.credentials.secret_key_base

  def self.encode(payload, exp = 15.minutes.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY, "HS256")
  end

  def self.decode(token)
    body = JWT.decode(token, SECRET_KEY, true, { algorithm: "HS256" })[0]
    HashWithIndifferentAccess.new body
  rescue JWT::DecodeError, JWT::ExpiredSignature => e
    nil
  end

  def self.generate_refresh_token
    SecureRandom.urlsafe_base64(64)
  end
end
