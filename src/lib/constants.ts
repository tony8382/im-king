export const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  shadow: '#AAAAAA',
  profileBG: '#f27777',
  challengeBG: '#eec147',
  libraryBG: '#2e3559',
  pBackground: '#2e3559',
  pBackground2: '#0190de',
  pText: '#07c9cc',
  room: {
    bg1: '#0190de',
    bg2: '#07c9cc',
    bg3: '#f2eac2',
    scoreBarBG1: '#d1cebb',
    scoreBarBG2: '#93bf9e',
    scoreBarBG3: '#a7a494',
    right: '#88a4ec',
    wrong: '#f48c8c',
  }
};

export const GAME_CONFIG = {
  levels: [
    { level: 1, questions: 5, time: 10, score: 10, name: '小威威', unlockScore: 0, aiSpeedMin: 4, aiSpeedMax: 8, aiAccuracy: 0.05, color: '#eec249' },
    { level: 2, questions: 5, time: 8, score: 20, name: '挽袖', unlockScore: 20, aiSpeedMin: 3, aiSpeedMax: 7, aiAccuracy: 0.1, color: '#f27877' },
    { level: 3, questions: 6, time: 8, score: 20, name: 'Yi-Shun', unlockScore: 50, aiSpeedMin: 3, aiSpeedMax: 7, aiAccuracy: 0.2, color: '#3242cc' },
    { level: 4, questions: 6, time: 8, score: 50, name: '憲坤Chiang', unlockScore: 100, aiSpeedMin: 2, aiSpeedMax: 4, aiAccuracy: 0.3, color: '#652eff' },
    { level: 5, questions: 6, time: 6, score: 50, name: '文Yau', unlockScore: 200, aiSpeedMin: 2, aiSpeedMax: 4, aiAccuracy: 0.4, color: '#07c9cc' },
    { level: 6, questions: 7, time: 5, score: 80, name: 'Pamela', unlockScore: 300, aiSpeedMin: 3, aiSpeedMax: 6, aiAccuracy: 0.5, color: '#2e3559' },
    { level: 7, questions: 8, time: 5, score: 100, name: 'inWei', unlockScore: 500, aiSpeedMin: 2, aiSpeedMax: 5, aiAccuracy: 0.65, color: '#b91c1c' }, // Dark Red
    { level: 8, questions: 10, time: 5, score: 200, name: 'TW WU', unlockScore: 1000, aiSpeedMin: 1, aiSpeedMax: 3, aiAccuracy: 0.7, color: '#000000' }, // Black
  ]
};
