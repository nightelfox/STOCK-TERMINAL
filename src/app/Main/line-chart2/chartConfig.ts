export const chartConfig = {
  scaleShowVerticalLines: true,
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        display: false,
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        display: false,
        ticks: {
          min: 1190,
          max: 1220,
        },
      },
    ],
  },
  hover: {
    mode: 'index',
    intersect: false,
  },
  animation: {
    duration: 0,
  },
  tooltips: {
    enabled: true,
    intersect: false,
    mode: 'index',
    xPadding: 8,
    yPadding: 8,
    caretPadding: 20,
    caretSize: 10,
    xAlign: 'center',
    yAlign: 'center',
    callbacks: {
      label(t) {
        // console.log(t);
        return `${t.value}`;
      },
    },
    cornerRadius: 10,
    titleFontSize: 10,
    backgroundColor: 'rgba(211, 211, 211, 0.5)',
    titleFontStyle: 'normal',
    titleFontColor: '#262626',
    bodyFontColor: '#262626',
    bodyFontStyle: 'bold',
    bodyFontSize: 12,
    displayColors: false,
  },
};
