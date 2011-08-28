		function PromptFactory(){
			this.name = $( "#name" );
			this.allFields = $( [] ).add( name );
			this.tips = $( ".validateTips" );
			console.log(this.allFields);
		}
			PromptFactory.prototype.updateTips = function updateTips( t ) {
				var self = this;
				this.tips
					.text( t )
					.addClass( "ui-state-highlight" );
				setTimeout(function() {
					self.tips.removeClass( "ui-state-highlight", 1500 );
				}, 500 );
			}

			PromptFactory.prototype.checkLength = function ( o, n, min, max ) {
				if ( o.val().length > max || o.val().length < min ) {
					o.addClass( "ui-state-error" );
					this.updateTips( "Length of " + n + " must be between " +
						min + " and " + max + "." );
					return false;
				} else {
					return true;
				}
			}
		
			PromptFactory.prototype.create = function(targetJQElement,question, valToSet){
				var that =this;
				targetJQElement.attr("title", question);
				targetJQElement.dialog({
					autoOpen: false,
					height: 250,
					width: 350,
					modal: true,
					closeOnEscape: false,
					open: function(){ $(".ui-dialog-titlebar-close").hide(); },
					buttons: {
						"Who are you?": function() {
							var bValid = true;
								that.allFields.removeClass( "ui-state-error" );
								bValid = bValid && that.checkLength( that.name, "username", 3, 16 );

							if ( bValid ) {
								//get the result
								valToSet = that.name.val();
								console.log(that.name.val());
								$( this ).dialog( "close" );
							}
						},
						Cancel: function() {
							$( this ).dialog( "close" );
						}
					},
					close: function() {
						that.allFields.val( "" ).removeClass( "ui-state-error" );
					}
				});
				targetJQElement.dialog( "open" );
			};
module.exports = PromptFactory;
