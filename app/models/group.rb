class Group
  include Mongoid::Document
  include Mixins::Models::Util::AttrReadonly

  after_create :set_channel

  field :subdomain, :type => String
  field :name, :type => String
  field :ws_channel, :type => String

  embeds_many :users do
    def superuser
      first{|u| u.superuser }
    end
    def enabled
      find_all{|u| !u.disabled }
    end
  end
  belongs_to :channel


  accepts_nested_attributes_for :users

  attr_readonly :ws_channel


  validates_presence_of :name, :subdomain
  validates_uniqueness_of :subdomain, :case_sensitive => false
  validates_exclusion_of :subdomain, :in => %w(www support media admin help), :message => "%s is reserved"

  validates_each :users do |document, attribute, value|
    users = value.to_a
    unless users.any?{|u| u.superuser && !u.disabled } && users.all?(&:valid?)
      document.errors.add(attribute, :invalid, :value => value)
    end
  end
  


  private

  def set_channel
    channel = Channel.create(:name => self.name)
    user = self.users.superuser
    self.channel = channel
    user.managed_channels << channel
    self.save
  end

end
