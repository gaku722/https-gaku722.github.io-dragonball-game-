// 入力システム / Input System

// プレイヤー1のキー設定 / Player 1 Key Configuration
const P1_KEYS = {
    left: 'KeyA',
    right: 'KeyD',
    up: 'KeyW',
    down: 'KeyS',
    punch: 'KeyQ',
    blast: 'KeyE',
    kamehameha: 'KeyZ',
    genkidama: 'KeyX',
    charge: 'KeyC',
    evolve: 'KeyF',
    guard: 'KeyR'
};

// プレイヤー2のキー設定 / Player 2 Key Configuration
const P2_KEYS = {
    left: 'KeyJ',
    right: 'KeyL',
    up: 'KeyI',
    down: 'KeyK',
    punch: 'KeyU',
    blast: 'KeyO',
    kamehameha: 'KeyM',
    genkidama: 'KeyN',
    charge: 'KeyP',
    evolve: 'KeyH',
    guard: 'KeyY'
};

// 入力状態管理 / Input State Management
class InputManager {
    constructor() {
        this.keys = {}; // 現在押されているキー / Currently pressed keys
        this.init();
    }

    init() {
        // キーダウンイベント / Key down event
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        // キーアップイベント / Key up event
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    // プレイヤー1の入力取得 / Get Player 1 input
    getP1Input() {
        return {
            left: this.keys[P1_KEYS.left] || false,
            right: this.keys[P1_KEYS.right] || false,
            up: this.keys[P1_KEYS.up] || false,
            down: this.keys[P1_KEYS.down] || false,
            punch: this.keys[P1_KEYS.punch] || false,
            blast: this.keys[P1_KEYS.blast] || false,
            kamehameha: this.keys[P1_KEYS.kamehameha] || false,
            genkidama: this.keys[P1_KEYS.genkidama] || false,
            charge: this.keys[P1_KEYS.charge] || false,
            evolve: this.keys[P1_KEYS.evolve] || false,
            guard: this.keys[P1_KEYS.guard] || false
        };
    }

    // プレイヤー2の入力取得 / Get Player 2 input
    getP2Input() {
        return {
            left: this.keys[P2_KEYS.left] || false,
            right: this.keys[P2_KEYS.right] || false,
            up: this.keys[P2_KEYS.up] || false,
            down: this.keys[P2_KEYS.down] || false,
            punch: this.keys[P2_KEYS.punch] || false,
            blast: this.keys[P2_KEYS.blast] || false,
            kamehameha: this.keys[P2_KEYS.kamehameha] || false,
            genkidama: this.keys[P2_KEYS.genkidama] || false,
            charge: this.keys[P2_KEYS.charge] || false,
            evolve: this.keys[P2_KEYS.evolve] || false,
            guard: this.keys[P2_KEYS.guard] || false
        };
    }
}
