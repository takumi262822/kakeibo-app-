/**
 * Application entry point and initialization class
 * @author Takumi Harada
 * @date 2026/3/31
 */
import { KakeiboEngine } from './core/kakeibo-engine.js';

// DOM 構築完了後にアプリを起動する
document.addEventListener('DOMContentLoaded', () => {
  window.app = new KakeiboEngine();
  window.app.init();
});
