import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
 
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class Stock_chart extends Component {	
	render(props) {

        var points = [];
        const dates = this.props.data.dates;
        const prices = this.props.data.closing_prices;

        //Create data points
        for(var i=0; i<dates.length; i++)
        {
            const date = dates[i];
            const price = prices[i];

            points.push({
                x: new Date(date * 1000), y: price
            })
        }

		const options = {
			animationEnabled: true,
			theme: "dark2",
			title:{
				text: this.props.data.title
			},
			axisX:{
				valueFormatString: "DD MMM",
				crosshair: {
					enabled: true,
					snapToDataPoint: true
				}
			},
			axisY: {
				title: "Closing Price (USD)",
				valueFormatString: "$##0.00",
				crosshair: {
					enabled: true,
					snapToDataPoint: true,
					labelFormatter: function(e) {
						return "$" + CanvasJS.formatNumber(e.value, "##0.00");
					}
				}
			},
			data: [{
				type: "area",
				xValueFormatString: "DD MMM",
				yValueFormatString: "$##0.00",
                dataPoints: points
			}]
		}
		
		return (
		<div>
			<CanvasJSChart options = {options} 
				 onRef={ref => this.chart = ref} 
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default Stock_chart;