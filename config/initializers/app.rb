class String
  def normalize
    mb_chars.normalize(:kd).gsub(/[^\x00-\x7F]/n, '').downcase.to_s
  end

  def urlize
    normalize.strip.gsub(/[^a-z0-9]+/i, '-')
  end
end

module Mongoid::Document
  def serializable_hash(options={})
    hash = super(options)
    if hash.has_key?("_id")
      hash.merge!({"id" => hash.delete("_id")})
    end
    hash
  end
end


class Hash
  def recursive_symbolize_keys!
    symbolize_keys!
    values.each { |h| h.recursive_symbolize_keys! if h.is_a?(Hash) }
    values.select { |v| v.is_a?(Array) }.flatten.each { |h| h.recursive_symbolize_keys! if h.is_a?(Hash) }
    self
  end
end

APP_CONFIG = YAML.load_file("#{Rails.root}/config/app_config.yml")[Rails.env].recursive_symbolize_keys!

