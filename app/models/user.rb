class User
  include Mongoid::Document
  include FayeBroadcaster

  field :email
  field :superuser, :type => Boolean, :default => false
  field :disabled, :type => Boolean, :default => false
  field :subscribed_channels_ids, :type => Array, :default => []

  embedded_in :group, :inverse_of => :users
  embeds_many :user_codes, :cascade_callbacks => true

  devise :database_authenticatable, :authentication_keys => [ :email, :subdomain ]

  references_many :managed_channels, :class_name => "Channel", :foreign_key => :owner_id, :inverse_of => :owner, :autosave => true, :validate => false

  references_many :received_messages, :foreign_key => "to", :inverse_of => :user, :class_name => "Message", :default_order => :created_at.desc
  references_many :sent_messages, :foreign_key => "from", :inverse_of => :user, :class_name => "Message", :default_order => :created_at.desc


  def self.find(*args)
    options = args.extract_options!
    user_options = Hash[*(options[:conditions] || {}).map { |k, v| [ :"users.#{k == :id ? :_id : k}", v ] }.flatten]
    if group = Group.find(*(args + [options.merge(:conditions => user_options)]))
      group.users.detect do |u|
        options[:conditions].all? { |k, v| u.send(k) == v }
      end
    else
      super
    end
  end

  def self.find_for_authentication(conditions={})
    if group = Group.where(:subdomain => conditions.delete(:subdomain)).first
      group.users.detect { |u| u.email == conditions[:email] }
    else
      nil
    end
  end

  def subscribed_channels
    Channel.where(:_id.in => subscribed_channels_ids).all
  end

  def send_channel_join_request(channel)
    !!unless subscribed_channels_ids.include?(channel.id)
      puts "not subscribed for #{channel.name}"
      if Channel.where("channel_join_requests.user_id".to_sym => self.id, :_id => channel.id ).count == 0
        puts "ok"
        channel.channel_join_requests.create(:user_id => self.id)
      end
    end
  end

  def subscribe_to_channel(channel)
    if !subscribed_channels_ids.include?(channel.id)
      subscribed_channels_ids << channel.id
      channel.inc(:subscribers_count, 1)
      return save
    end
    false
  end

  def channels
    subscribed_channels + managed_channels
  end

  def pending_channels
    Channel.where("channel_join_requests.user_id" => id)
  end

  def admin_settings
    {ws_url: FayeBroadcaster::ENDPOINT, channel: self.group.channel.id, id: self.id, email: self.email }
  end


end
