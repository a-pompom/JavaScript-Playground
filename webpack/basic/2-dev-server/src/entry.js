import { world } from './world';

// console.logでは結果が見えづらいので、HTMLへ描画するよう変更
document.getElementById('content').textContent = `Hello, ${world}!!`;