// UI更新システム / UI Update System

class UIManager {
    constructor() {
        // プレイヤー1の要素 / Player 1 elements
        this.p1HpBar = document.getElementById('p1-hp-bar');
        this.p1HpText = document.getElementById('p1-hp-text');
        this.p1StaminaBar = document.getElementById('p1-stamina-bar');
        this.p1StaminaText = document.getElementById('p1-stamina-text');
        this.p1FormName = document.getElementById('p1-form-name');

        // プレイヤー2の要素 / Player 2 elements
        this.p2HpBar = document.getElementById('p2-hp-bar');
        this.p2HpText = document.getElementById('p2-hp-text');
        this.p2StaminaBar = document.getElementById('p2-stamina-bar');
        this.p2StaminaText = document.getElementById('p2-stamina-text');
        this.p2FormName = document.getElementById('p2-form-name');
    }

    // プレイヤー1のUI更新 / Update Player 1 UI
    updatePlayer1(player) {
        // HP更新 / Update HP
        const hpPercent = (player.hp / player.maxHP) * 100;
        this.p1HpBar.style.width = hpPercent + '%';
        this.p1HpText.textContent = `${Math.ceil(player.hp)} / ${player.maxHP}`;

        // HP色変更（残りHPに応じて） / Change HP color based on remaining HP
        if (hpPercent > 60) {
            this.p1HpBar.style.background = 'linear-gradient(90deg, #00ff00 0%, #00cc00 100%)';
        } else if (hpPercent > 30) {
            this.p1HpBar.style.background = 'linear-gradient(90deg, #ffff00 0%, #ffcc00 100%)';
        } else {
            this.p1HpBar.style.background = 'linear-gradient(90deg, #ff0000 0%, #cc0000 100%)';
        }

        // スタミナ更新 / Update Stamina
        const staminaPercent = (player.stamina / player.maxStamina) * 100;
        this.p1StaminaBar.style.width = staminaPercent + '%';
        this.p1StaminaText.textContent = `${Math.ceil(player.stamina)} / ${player.maxStamina}`;

        // スタミナ色変更（進化可能時は金色） / Change stamina color (gold when can evolve)
        if (player.canEvolve) {
            this.p1StaminaBar.style.background = 'linear-gradient(90deg, #ffd700 0%, #ffaa00 100%)';
        } else {
            this.p1StaminaBar.style.background = 'linear-gradient(90deg, #00ffff 0%, #0088ff 100%)';
        }

        // 形態名更新 / Update form name
        this.p1FormName.textContent = player.form.name;
        this.p1FormName.style.color = player.form.color;
    }

    // プレイヤー2のUI更新 / Update Player 2 UI
    updatePlayer2(player) {
        // HP更新 / Update HP
        const hpPercent = (player.hp / player.maxHP) * 100;
        this.p2HpBar.style.width = hpPercent + '%';
        this.p2HpText.textContent = `${Math.ceil(player.hp)} / ${player.maxHP}`;

        // HP色変更 / Change HP color
        if (hpPercent > 60) {
            this.p2HpBar.style.background = 'linear-gradient(90deg, #00ff00 0%, #00cc00 100%)';
        } else if (hpPercent > 30) {
            this.p2HpBar.style.background = 'linear-gradient(90deg, #ffff00 0%, #ffcc00 100%)';
        } else {
            this.p2HpBar.style.background = 'linear-gradient(90deg, #ff0000 0%, #cc0000 100%)';
        }

        // スタミナ更新 / Update Stamina
        const staminaPercent = (player.stamina / player.maxStamina) * 100;
        this.p2StaminaBar.style.width = staminaPercent + '%';
        this.p2StaminaText.textContent = `${Math.ceil(player.stamina)} / ${player.maxStamina}`;

        // スタミナ色変更 / Change stamina color
        if (player.canEvolve) {
            this.p2StaminaBar.style.background = 'linear-gradient(90deg, #ffd700 0%, #ffaa00 100%)';
        } else {
            this.p2StaminaBar.style.background = 'linear-gradient(90deg, #00ffff 0%, #0088ff 100%)';
        }

        // 形態名更新 / Update form name
        this.p2FormName.textContent = player.form.name;
        this.p2FormName.style.color = player.form.color;
    }

    // 両方のプレイヤーを更新 / Update both players
    update(player1, player2) {
        this.updatePlayer1(player1);
        this.updatePlayer2(player2);
    }
}
