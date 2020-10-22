export const initStore = (docId = 'tetris', delay = 500) => {
  return {
    docId,
    delay,
    currentScore: 0,
    highestScore: 0,
  };
}
