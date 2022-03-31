<template>
  <ApexChart type="rangeBar" width="800" :options="chartOptions" :series="series" />
</template>

<script>
export default {
  name: "TimelineChart",
  data() {
    return {
      series: [
        {
          name: 'Bob',
          data: [
            {
              x: 'Design',
              y: [
                new Date('2019-03-05').getTime(),
                new Date('2019-03-08').getTime()
              ]
            },
            {
              x: 'Code',
              y: [
                new Date('2019-03-08').getTime(),
                new Date('2019-03-11').getTime()
              ]
            },
            {
              x: 'Test',
              y: [
                new Date('2019-03-11').getTime(),
                new Date('2019-03-16').getTime()
              ]
            }
          ]
        },
        {
          name: 'Joe',
          data: [
            {
              x: 'Design',
              y: [
                new Date('2019-03-02').getTime(),
                new Date('2019-03-05').getTime()
              ]
            },
            {
              x: 'Code',
              y: [
                new Date('2019-03-06').getTime(),
                new Date('2019-03-09').getTime()
              ]
            },
            {
              x: 'Test',
              y: [
                new Date('2019-03-10').getTime(),
                new Date('2019-03-19').getTime()
              ]
            }
          ]
        }
      ],
      chartOptions: {
        chart: {
          height: 400,
          type: 'rangeBar'
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function(val) {
            const a = moment(val[0]);
            const b = moment(val[1]);
            const diff = b.diff(a, 'days');
            return diff + (diff > 1 ? ' days' : ' day')
          }
        },
        xaxis: {
          type: 'datetime'
        },
        legend: {
          position: 'bottom'
        }
      },
    }
  }
}
</script>
