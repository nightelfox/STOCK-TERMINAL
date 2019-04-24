//Функция для расчета столбцов для легенды
export function chunkHelper(data, numberOfChunks) {
  const result = [];
  let remainingToDistribute = data.length;

  while (result.length < numberOfChunks) {
    const maxNumberOfElementsInChunk = Math.ceil(
      remainingToDistribute / (numberOfChunks - result.length)
    );
    const currentlyDistributed = data.length - remainingToDistribute;
    const currentChunk = data.slice(
      currentlyDistributed,
      currentlyDistributed + maxNumberOfElementsInChunk
    );

    result.push(currentChunk);
    remainingToDistribute = remainingToDistribute - currentChunk.length;
  }

  return result;
}

//Осознаю, что плохо влияет на производительность
export function clone(object) {
  return JSON.parse(JSON.stringify(object));
}

export function processMainData(data, timeScale) {
  const chartDates = [];

  if (timeScale === '1d') {
    data = processData(data);
    data.chart.forEach(element => {
      element.regionId = '1';
      element.date = new Date(`2019-04-24T${element.minute}:00.000Z`);
      chartDates.push(element.date.toString().slice(0, 15));
    });
  } else {
    data.chart.forEach(element => {
      element.regionId = '1';
      element.date = new Date(element.date);
      chartDates.push(element.date.toString().slice(0, 15));
    });
  }

  return { chartDates, data };
}

export function processData(data) {
  let lastValues = [0, 0, 0, 0];
  data.chart.forEach(element => {
    if (element.close === null || element.close === -1) {
      element.close = lastValues[3];
    } else {
      lastValues[3] = element.close;
    }
    if (element.open === null || element.open === -1) {
      element.open = lastValues[0];
    } else {
      lastValues[0] = element.open;
    }
    if (element.high === null || element.high === -1) {
      element.high = lastValues[1];
    } else {
      lastValues[1] = element.high;
    }
    if (element.low === null || element.low === -1) {
      element.low = lastValues[2];
    } else {
      lastValues[2] = element.low;
    }
  });
  return data;
}

export function process1Day(data, id) {
  const temp = [];
    data.chart.forEach((element, i) => {
    element.regionId = id;
    element.date = new Date(`2019-04-24T${element.minute}:00.000Z`);
    temp.push(data.chart[i]);
  });
  return temp;
}

export function processMonth(data, id) {
  const temp = [];
  data.chart.forEach((element, i) => {
    element.regionId = id;
    element.date = new Date(element.date);
    temp.push(data.chart[i]);
  });
  return temp;
}
