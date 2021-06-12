"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = __importStar(require("readline"));
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.setPrompt('手(rock, scissors, paper)を入力してください(ENDで終了): ');
rl.prompt();
rl.on('line', function (line) {
    var input = line.trim();
    if (input === 'END') {
        rl.close();
        return;
    }
    if (!isHand(input)) {
        console.log('rock, scissors, paper, ENDのいずれかを入力してください');
        rl.prompt();
        return;
    }
    var userHand = input;
    var cpuHand = generateCPUHand();
    judge(userHand, cpuHand);
    rl.prompt();
});
/**
 * 入力がじゃんけんの手として有効か判定
 *
 * @param input 入力文字列
 */
var isHand = function (input) {
    switch (input) {
        case 'rock':
        case 'scissors':
        case 'paper':
            return true;
    }
    return false;
};
/**
 * CPU用のじゃんけんの手を生成
 *
 * @return じゃんけんの手
 */
var generateCPUHand = function () {
    var hands = ['rock', 'scissors', 'paper'];
    var cpuHandIndex = Math.floor(Math.random() * hands.length);
    return hands[cpuHandIndex];
};
/**
 * じゃんけんの勝敗を判定
 *
 * @param user ユーザの手
 * @param cpu CPUの手
 */
var judge = function (user, cpu) {
    // あいこ
    if (user === cpu) {
        console.log('DRAW...');
        return;
    }
    // じゃんけんの手を数値化
    // (自身の手 - 相手の手) = 1のとき、ユーザの勝利 先頭(0)は直前と比較できるよう回り込みが発生
    var hands = {
        paper: 0,
        scissors: 1,
        rock: 2,
        tail: 3,
    };
    // 勝利
    // paperは直前が存在しないため、そのままでは比較できない
    // 直前をrockとして比較できるよう末尾へ移動
    if (user === 'paper') {
        hands.paper = hands.tail;
    }
    var isUserWin = hands[user] - hands[cpu] === 1;
    if (isUserWin) {
        console.log('YOU WIN!!');
        return;
    }
    // 敗北
    console.log('YOU LOSE...');
};
//# sourceMappingURL=rockScissorsPaper.js.map