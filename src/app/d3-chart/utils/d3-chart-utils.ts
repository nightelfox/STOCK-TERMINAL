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
