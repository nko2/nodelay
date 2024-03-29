		function PromptFactory(){
			this.name = $( "#name" );
			this.allFields = $( [] ).add( name );
			this.tips = $( ".validateTips" );
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
		
		PromptFactory.prototype.create = function(targetJQElement,question, callback){
				var that =this;
				targetJQElement.dialog({
					autoOpen: false,
					width: 350,
					modal: true,
					closeOnEscape: false,
					open: function(){ $(".ui-dialog-titlebar-close").hide(); },
					buttons: {
						"OK": function() {
							okay(that,callback);
						},
						Cancel: function() {
							that.allFields.removeClass( "ui-state-error" );
							$( this ).dialog( "close" );
						}
					},
					close: function() {
						that.allFields.removeClass( "ui-state-error" );
					}
				});
				$('#ui-dialog-title-dialog-form').text(question);
				targetJQElement.dialog( "open" );
				
				$(document).keydown(function(evt) {
					if (evt.keyCode == 13) {						
						okay(that,callback);
						evt.preventDefault();
				}
		});
				
			};
			
			
			function okay(that,callback){
			
						var bValid = true;
								that.allFields.removeClass( "ui-state-error" );
								bValid = bValid && that.checkLength( that.name, "username", 3, 16 );

							if ( bValid ) {
								//get the result
								callback(that.name.val());
								that.allFields.removeClass( "ui-state-error" );
								$( '#dialog-form' ).dialog( "close" );
							}
			}
			
	
module.exports = PromptFactory;

