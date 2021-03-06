define(["./BaseCanvasView", "app/models/Style", "libs/Backbone.Framework"], 

function(BaseCanvasView, Style) {
    
	var BaseSubCanvasView = BaseCanvasView.extend({
		
		isSub:true,
		
		initialize: function (attrs) {
			_.bindAll(this, 'updateDrawMethod', 'draw', 'getContext');
			this.views = [];
			this.style = attrs.style || new Style();
			if (this.model) this.setModel(this.model);		
		},

		setModel: function (model) {
			var model = this.model = model,
			shape = model.get('shape');

			shape.bind('change:type', this.updateDrawMethod);		
			this.updateDrawMethod({ silent : true });		

		},

		draw : function () {	
			
			var m = this.model.toJSON(),
				ctx = this.getContext(),
				x, y, w, h;

			if (ctx) {

				ctx.save();
				
				ctx.scale(m.scaleX, m.scaleY);

				if ( _.isFunction(this.drawShape) ) {		
					if (this.style.get('centred') === true) {
						x = (- m.width * 0.5) + 0.5;
						y = (- m.height * 0.5) + 0.5;
					} else {
						x = m.x + 0.5;
						y = m.y + 0.5;
					}
					this.drawShape( ctx, x, y, m.width, m.height, this.style.toJSON() );				
				}

				_(this.views).each( function (view) {
					view.draw();
				});

				ctx.restore();
			}

		},

		updateDrawMethod : function( params ) {

			switch ( this.model.get('shape').get('type').sides ) {
			case 4 :  
				this.drawShape = this.style.get('inverted') ? this.drawRectangularShapeInverted : this.drawRectangularShape;
				break;
			case 1 :  
				this.drawShape = this.drawEllipticalShape;
				break;
			case -1 : 
				this.drawShape = null;
				break;
			default : 
				this.drawShape = null;
			}

			if ( !params.silent ) this.draw();
		}
		
	});
	
	return BaseSubCanvasView;
	
});