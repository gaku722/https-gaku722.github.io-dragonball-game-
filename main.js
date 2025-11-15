// メインゲームループ / Main Game Loop

class Game {
    constructor() {
        // Canvas設定 / Canvas setup
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1280;
        this.canvas.height = 720;

        // システム / Systems
        this.inputManager = new InputManager();
        this.uiManager = new UIManager();

        // プレイヤー / Players
        this.player1 = new Player(1, 300, 600, 1);
        this.player2 = new Player(2, 980, 600, -1);

        // プロジェクタイル配列 / Projectiles array
        this.projectiles = [];

        // タイミング / Timing
        this.lastTime = 0;

        // ゲーム状態 / Game state
        this.isPaused = false;
        this.gameOver = false;
        this.winner = null;
    }

    // 初期化 / Initialize
    init() {
        console.log('ゲーム開始！ / Game Start!');
        this.gameLoop(0);
    }

    // ゲームループ / Game Loop
    gameLoop(currentTime) {
        // デルタタイム計算 / Calculate delta time
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // 更新と描画 / Update and draw
        if (!this.isPaused && !this.gameOver) {
            this.update(deltaTime);
        }
        this.draw();

        // 次のフレーム / Next frame
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // 更新 / Update
    update(deltaTime) {
        // デルタタイムが大きすぎる場合は制限（タブ切り替え対策） / Limit delta time (for tab switching)
        if (deltaTime > 0.1) deltaTime = 0.016;

        // 入力取得 / Get input
        const p1Input = this.inputManager.getP1Input();
        const p2Input = this.inputManager.getP2Input();

        // プレイヤー更新 / Update players
        this.player1.update(deltaTime, p1Input, this.player2, this.projectiles);
        this.player2.update(deltaTime, p2Input, this.player1, this.projectiles);

        // プロジェクタイル更新 / Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(deltaTime);

            // 当たり判定チェック / Check collision
            const target = projectile.owner === this.player1 ? this.player2 : this.player1;
            if (projectile.checkCollision(target)) {
                // ダメージ適用 / Apply damage
                const knockbackX = projectile.direction * ATTACK_DATA[projectile.type].knockback;
                target.takeDamage(
                    projectile.damage,
                    knockbackX,
                    ATTACK_DATA[projectile.type].hitStun,
                    projectile.owner.form // 攻撃者のフォーム情報を渡す / Pass attacker's form info
                );

                // 継続ダメージでない場合は削除 / Remove if not continuous
                if (!projectile.isContinuous) {
                    projectile.active = false;
                }
            }

            // 非アクティブなプロジェクタイルを削除 / Remove inactive projectiles
            if (!projectile.active) {
                this.projectiles.splice(i, 1);
            }
        }

        // UI更新 / Update UI
        this.uiManager.update(this.player1, this.player2);

        // 勝敗判定 / Check win condition
        if (this.player1.hp <= 0) {
            this.gameOver = true;
            this.winner = 2;
        } else if (this.player2.hp <= 0) {
            this.gameOver = true;
            this.winner = 1;
        }
    }

    // 描画 / Draw
    draw() {
        // 背景クリア / Clear background
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 地面描画 / Draw ground
        this.ctx.fillStyle = '#2a2a4e';
        this.ctx.fillRect(0, 600, this.canvas.width, this.canvas.height - 600);

        // グリッド線（地面） / Grid lines (ground)
        this.ctx.strokeStyle = '#3a3a6e';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 600);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }

        // プロジェクタイル描画 / Draw projectiles
        this.projectiles.forEach(projectile => {
            projectile.draw(this.ctx);
        });

        // プレイヤー描画 / Draw players
        this.player1.draw(this.ctx);
        this.player2.draw(this.ctx);

        // ゲームオーバー表示 / Game over display
        if (this.gameOver) {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 72px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`PLAYER ${this.winner} WINS!`, this.canvas.width / 2, this.canvas.height / 2 - 50);

            this.ctx.font = '24px Arial';
            this.ctx.fillText('Press R to Restart', this.canvas.width / 2, this.canvas.height / 2 + 50);
            this.ctx.restore();

            // リスタート処理 / Restart handling
            window.addEventListener('keydown', (e) => {
                if (e.code === 'KeyR' && this.gameOver) {
                    this.restart();
                }
            });
        }

        // デバッグ情報（オプション） / Debug info (optional)
        this.drawDebugInfo();
    }

    // デバッグ情報描画 / Draw debug info
    drawDebugInfo() {
        this.ctx.save();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';

        // プロジェクタイル数 / Projectile count
        this.ctx.fillText(`Projectiles: ${this.projectiles.length}`, 10, this.canvas.height - 10);

        this.ctx.restore();
    }

    // リスタート / Restart
    restart() {
        this.player1 = new Player(1, 300, 600, 1);
        this.player2 = new Player(2, 980, 600, -1);
        this.projectiles = [];
        this.gameOver = false;
        this.winner = null;
        this.uiManager.update(this.player1, this.player2);
    }
}

// ゲーム開始 / Start game
window.addEventListener('load', () => {
    const game = new Game();
    game.init();
});
