<template>
  <ApexChart type="bar" :height="chartOptions.chart.height" :options="chartOptions" :series="series" />
</template>

<script>
export default {
  name: "GlobalBar",
  props: {
    title: String,
    series: [
      {
        name: String,
        data: Array
      }
    ],
    xcategories: Array,
    xtitle: String,
    ytitle: String,
    ymin: Number,
    ymax: Number
  },
  data() {
    return {
      chartOptions: {
        chart: {
          height: 600,
          type: 'line',
          dropShadow: {
            enabled: false,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: true
          }
        },
        colors: ['#77B6EA', '#545454'],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: this.title,
          align: 'left'
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        markers: {
          size: 1
        },
        xaxis: {
          categories: this.xcategories,
          title: {
            text: this.xtitle
          }
        },
        yaxis: {
          title: {
            text: this.ytitle
          },
          min: this.ymin,
          max: this.ymax
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
      },
    }
  }
}
</script>
