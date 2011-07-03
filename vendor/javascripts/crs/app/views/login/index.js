Ext.define("Crs.app.views.login.Index",{
    extend:"Ext.form.FormPanel",
    mixins:{
        base: "Fwk.app.views.Base"
    },

    initComponent: function(){
        var self = this

        Ext.apply(self.initialConfig,{
            url: "/sign_in"
        })

        Ext.apply(self,{
            bodyPadding: 10,
            bodyBorder: false,
            labelAlign:"top",
            border:false,
            defaults:{
                xtype: 'textfield',
                anchor: '100%',
                labelAlign: "top",
                allowBlank: false
            },
            items:[{
                name: 'user[email]',
                fieldLabel: 'Email Address',
                vtype: 'email',
                value:"admin@interpretor.ro"
            },{
                name: 'user[password]',
                fieldLabel: 'Password',
                inputType: 'password',
                style: 'margin-top:15px',
                value:"demo"
            }],
            buttons:["->",{
                text: 'Reset',
                handler: function() {
                    this.up('form').getForm().reset();
                }
            },{
                formBind: true,
                text: 'Submit',
                handler: function() {
                    var panel = this.up("form"), form = panel.getForm(), mask = panel.setLoading("Please wait...")
mask.hide()
                    if (form.isValid()) {
                        form.submit({
                            success: function(form, action) {
                                var app = Crs.app.App
                                app.setUserInfo(action.result)
                                app.goToHome()

                            },
                            failure: function(form, action) {
                                mask.hide()
                            }
                        })
                    }
                }
            }],
            buttonAlign:"center"
        })

        self.callParent(arguments)
    }
})