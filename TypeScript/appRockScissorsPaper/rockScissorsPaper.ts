import * as readline from 'readline';

type Hand = 'rock' | 'paper' | 'scissors';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt('手(rock, scissors, paper)を入力してください(ENDで終了): ');
rl.prompt();

rl.on('line', (line: string) => {

    const input = line.trim();

    if (input === 'END') {
        rl.close();
        return;
    }
    if (! isHand(input)) {
        console.log('rock, scissors, paper, ENDのいずれかを入力してください');
        rl.prompt();
        return;
    }

    const userHand: Hand = input;
    const cpuHand: Hand = generateCPUHand();
    judge(userHand, cpuHand);

    rl.prompt();
});

/**
 * 入力がじゃんけんの手として有効か判定
 *
 * @param input 入力文字列
 */
const isHand = (input: string | Hand): input is Hand => {

    switch(input) {
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
const generateCPUHand = (): Hand => {
    const hands: Hand[] = ['rock', 'scissors', 'paper'];
    const cpuHandIndex = Math.floor(Math.random() * hands.length);

    return hands[cpuHandIndex];
};

/**
 * じゃんけんの勝敗を判定
 *
 * @param user ユーザの手
 * @param cpu CPUの手
 */
const judge = (user: Hand, cpu: Hand): void => {

    // あいこ
    if (user === cpu) {
        console.log('DRAW...');
        return;
    }

    // じゃんけんの手を数値化
    // (自身の手 - 相手の手) = 1のとき、ユーザの勝利 先頭(0)は直前と比較できるよう回り込みが発生
    const hands: {[key in Hand | 'tail']: number} = {
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
    const isUserWin = hands[user] - hands[cpu] === 1;
    if (isUserWin) {
        console.log('YOU WIN!!');
        return;
    }

    // 敗北
    console.log('YOU LOSE...');
};