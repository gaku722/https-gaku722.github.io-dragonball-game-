// 攻撃システム / Attack System

// 攻撃基本データ / Base Attack Data
const ATTACK_DATA = {
    punch: {
        baseDamage: 15,
        staminaCost: 0,
        cooldown: 0.7,
        range: 80,
        speed: 0, // 即座に当たる / Instant hit
        startupLag: 0.3,
        hitStun: 0.2,
        knockback: 30,
        isProjectile: false
    },
    blast: {
        baseDamage: 10,
        staminaCost: 5,
        cooldown: 0.3,
        range: 1280, // 画面全体 / Full screen
        speed: 600, // ピクセル/秒 / pixels per second
        startupLag: 0,
        hitStun: 0.3,
        knockback: 50,
        isProjectile: true,
        projectileWidth: 20,
        projectileHeight: 20
    },
    kamehameha: {
        baseDamage: 7, // 1フレームあたり / Per frame
        staminaCost: 30,
        cooldown: 7,
        range: 660, // 画面の半分 / Half screen
        speed: 1000, // ビームが伸びる速度 / Beam extension speed
        startupLag: 0, // チャージ時は動ける / Can move while charging
        releaseLag: 1.0, // 発射時は動けない / Can't move when firing
        hitStun: 0.5,
        knockback: 20, // 継続的に押す / Continuous push
        isProjectile: true,
        isContinuous: true, // 継続ダメージ / Continuous damage
        projectileWidth: 60,
        projectileHeight: 60,
        duration: 1.5, // ビームの持続時間 / Beam duration
        minChargeTime: 0.5, // 最小チャージ時間 / Minimum charge time
        maxChargeTime: 4.0, // 最大チャージ時間 / Maximum charge time
        chargeDamageMultiplier: 2.0 // チャージで最大2倍 / Up to 2x with charge
    },
    genkidama: {
        baseDamage: 60,
        staminaCost: 90,
        cooldown: 14,
        range: 640,
        speed: 200,
        startupLag: 2.0, // チャージから発射まで動けない / Can't move from charge to release
        hitStun: 1.0,
        knockback: 150,
        isProjectile: true,
        projectileWidth: 150, // サイズを大きく / Larger size
        projectileHeight: 150, // サイズを大きく / Larger size
        requiresCharge: 90 // スタミナ90%以上必要 / Requires 90% stamina
    }
};

// プロジェクタイル（飛び道具）クラス / Projectile Class
class Projectile {
    constructor(x, y, direction, attackType, owner, damage) {
        this.x = x;
        this.y = y;
        this.direction = direction; // 1 = 右, -1 = 左 / 1 = right, -1 = left
        this.type = attackType;
        this.owner = owner; // どのプレイヤーの攻撃か / Which player's attack
        this.damage = damage;
        this.active = true;

        const data = ATTACK_DATA[attackType];
        this.speed = data.speed;
        this.width = data.projectileWidth;
        this.height = data.projectileHeight;
        this.range = data.range;
        this.startX = x;
        this.isContinuous = data.isContinuous || false;

        // 連続ダメージのクールダウン / Continuous damage cooldown
        this.damageTimer = 0; // 連続ダメージ用タイマー / Timer for continuous damage
        this.damageInterval = 0.2; // 0.2秒ごとにダメージ / Damage every 0.2 seconds

        // カメハメハ専用のプロパティ / Kamehameha-specific properties
        if (attackType === 'kamehameha') {
            this.currentLength = 0; // 現在のビームの長さ / Current beam length
            this.maxLength = 600; // 最大ビームの長さ / Maximum beam length
            this.lifeTime = 0; // 生存時間 / Life time
            this.duration = data.duration; // 持続時間 / Duration
        }
    }

    update(deltaTime) {
        // カメハメハの特別な処理 / Special handling for Kamehameha
        if (this.type === 'kamehameha') {
            // 生存時間を更新 / Update life time
            this.lifeTime += deltaTime;

            // ビームを伸ばす / Extend beam
            this.currentLength = Math.min(this.currentLength + this.speed * deltaTime, this.maxLength);

            // プレイヤーの位置を追跡 / Track player position
            this.x = this.owner.x + this.owner.facing * 40;
            this.y = this.owner.y - 30;

            // 持続時間を超えたら消える / Deactivate after duration
            if (this.lifeTime >= this.duration) {
                this.active = false;
            }

            // 連続ダメージタイマー更新 / Update continuous damage timer
            if (this.damageTimer > 0) {
                this.damageTimer -= deltaTime;
            }

            return;
        }

        // 通常の飛び道具の移動 / Normal projectile movement
        this.x += this.speed * this.direction * deltaTime;

        // 連続ダメージタイマー更新 / Update continuous damage timer
        if (this.damageTimer > 0) {
            this.damageTimer -= deltaTime;
        }

        // 射程範囲チェック / Range check
        if (Math.abs(this.x - this.startX) > this.range) {
            this.active = false;
        }

        // 画面外チェック / Out of bounds check
        if (this.x < -100 || this.x > 1380) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();

        // 攻撃タイプに応じた描画 / Draw based on attack type
        switch(this.type) {
            case 'blast':
                ctx.fillStyle = this.owner.form.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.owner.form.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'kamehameha':
                // ビーム描画（プレイヤーから伸びる） / Draw beam (extending from player)
                const beamLength = this.currentLength; // 現在の長さ / Current length
                const beamWidth = this.height; // ビームの太さ / Beam thickness

                // グラデーション（縦方向） / Gradient (vertical)
                const gradient = ctx.createLinearGradient(
                    this.x,
                    this.y - beamWidth / 2,
                    this.x,
                    this.y + beamWidth / 2
                );
                gradient.addColorStop(0, this.owner.form.color + '00');
                gradient.addColorStop(0.5, this.owner.form.color);
                gradient.addColorStop(1, this.owner.form.color + '00');

                ctx.fillStyle = gradient;
                ctx.shadowBlur = 30;
                ctx.shadowColor = this.owner.form.color;

                // 方向に応じてビームを描画（プレイヤーから伸びる） / Draw beam based on direction (extending from player)
                if (this.direction > 0) {
                    // 右方向 / Right direction
                    ctx.fillRect(
                        this.x,
                        this.y - beamWidth / 2,
                        beamLength,
                        beamWidth
                    );
                } else {
                    // 左方向 / Left direction
                    ctx.fillRect(
                        this.x - beamLength,
                        this.y - beamWidth / 2,
                        beamLength,
                        beamWidth
                    );
                }
                break;

            case 'genkidama':
                const genkiGradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.width / 2
                );
                genkiGradient.addColorStop(0, '#ffffff');
                genkiGradient.addColorStop(0.5, this.owner.form.color);
                genkiGradient.addColorStop(1, this.owner.form.color + '44');

                ctx.fillStyle = genkiGradient;
                ctx.shadowBlur = 50;
                ctx.shadowColor = this.owner.form.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
        }

        ctx.restore();
    }

    // 当たり判定チェック / Collision check
    checkCollision(target) {
        if (!this.active || this.owner === target) return false;

        // 連続ダメージのクールダウン中はヒットしない / Don't hit during cooldown
        if (this.isContinuous && this.damageTimer > 0) return false;

        // カメハメハ（ビーム）の当たり判定 / Kamehameha (beam) collision
        if (this.type === 'kamehameha') {
            const beamLength = this.currentLength; // 現在の長さを使用 / Use current length
            const beamWidth = this.height; // ビームの太さ / Beam thickness

            // ビームの矩形範囲（プレイヤーの位置から） / Beam rectangle area (from player position)
            let beamLeft, beamRight;
            if (this.direction > 0) {
                beamLeft = this.x;
                beamRight = this.x + beamLength;
            } else {
                beamLeft = this.x - beamLength;
                beamRight = this.x;
            }
            const beamTop = this.y - beamWidth / 2;
            const beamBottom = this.y + beamWidth / 2;

            // ターゲットの矩形範囲 / Target rectangle area
            const targetLeft = target.x - target.width / 2;
            const targetRight = target.x + target.width / 2;
            const targetTop = target.y - target.height;
            const targetBottom = target.y;

            // 矩形同士の衝突判定 / Rectangle collision detection
            const collision = beamLeft < targetRight &&
                beamRight > targetLeft &&
                beamTop < targetBottom &&
                beamBottom > targetTop;

            if (collision && this.isContinuous) {
                // 連続ダメージの場合、タイマーをリセット / Reset timer for continuous damage
                this.damageTimer = this.damageInterval;
            }

            return collision;
        }

        // 通常の円形当たり判定（blast, genkidama） / Normal circular collision (blast, genkidama)
        const dx = this.x - target.x;
        const dy = this.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < (this.width / 2 + target.width / 2);
    }
}
