<template>
  <apexchart type="bar" height="400" :options="chartOptions" :series="series" />
</template>

<script>
export default {
  name: "BarChart",
  data() {
    return {
      series: [
        {
          name: "No of hours",
          data: [10, 30, 20, 15, 35, 25, 10, 20, 30, 35]
        }

      ],
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: false
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
          text: 'Attendance',
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
          categories: ['Alex Karev', 'Cristina ', 'Meredith Grey', 'Izzie', 'Amelia Shepherd', 'Derek Shepherd', 'Owen',
            'Teddy Altman', 'George', 'Miranda Bailey'],
          title: {
            text: 'Students'
          }
        },
        yaxis: {
          title: {
            text: 'Time (minutes) spent in a session'
          },
          min: 0,
          max: 40
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
