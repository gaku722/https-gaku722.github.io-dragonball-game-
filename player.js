// プレイヤークラス / Player Class

class Player {
    constructor(id, x, y, facing = 1) {
        this.id = id; // 1 or 2
        this.x = x;
        this.y = y;
        this.vx = 0; // X方向速度 / X velocity
        this.vy = 0; // Y方向速度 / Y velocity
        this.facing = facing; // 1 = 右向き, -1 = 左向き / 1 = right, -1 = left

        // 形態システム / Form system
        this.formId = 1;
        this.form = getFormById(1);

        // リソース / Resources
        this.maxHP = 100;
        this.hp = 100;
        this.maxStamina = 100;
        this.stamina = 100;

        // サイズ / Size
        this.width = 60;
        this.height = 100;

        // 状態 / State
        this.isGrounded = false;
        this.isFlying = false;
        this.isCharging = false;
        this.isGuarding = false;
        this.isStunned = false;
        this.canEvolve = false;

        // 攻撃状態 / Attack state
        this.attackCooldowns = {
            punch: 0,
            blast: 0,
            kamehameha: 0,
            genkidama: 0
        };
        this.chargingKamehameha = false;
        this.kamehamehaChargeTime = 0;

        // タイマー / Timers
        this.stunTimer = 0;
        this.startupLagTimer = 0;

        // 移動速度 / Movement speed
        this.moveSpeed = 300;
        this.jumpPower = 500;
        this.flySpeed = 200;
        this.dashSpeed = 600;

        // 物理 / Physics
        this.gravity = 1200;
        this.groundY = 600; // 地面の高さ / Ground level

        // 進化必要条件 / Evolution requirement
        this.evolveThreshold = 100; // スタミナ100%で進化可能 / Can evolve at 100% stamina
    }

    // ステータス更新（形態変化時） / Update stats on form change
    updateStats() {
        const form = this.form;
        this.maxHP = 100 + form.hpBonus;
        this.maxStamina = 100 + form.staminaBonus;

        // 進化可能チェック / Check if can evolve
        this.canEvolve = this.stamina >= this.maxStamina && this.formId < 32;
    }

    // 進化 / Evolve
    evolve() {
        if (!this.canEvolve) return false;

        const nextForm = getNextForm(this.formId);
        if (!nextForm) return false;

        this.formId = nextForm.id;
        this.form = nextForm;
        this.updateStats();

        // HP全回復 / Full HP recovery
        this.hp = this.maxHP;

        // スタミナリセット / Reset stamina
        this.stamina = 0;
        this.canEvolve = false;

        return true;
    }

    // Kiチャージ / Charge Ki
    chargeKi(deltaTime) {
        if (this.isStunned || this.startupLagTimer > 0) return;

        this.isCharging = true;
        const previousStamina = this.stamina;
        this.stamina = Math.min(this.stamina + 3 * deltaTime * 60, this.maxStamina);

        // スタミナがマックスに達したら進化可能に / Can evolve when stamina reaches max
        if (this.stamina >= this.maxStamina && previousStamina < this.maxStamina && this.formId < 32) {
            this.canEvolve = true;
        }
    }

    // ダメージ受ける / Take damage
    takeDamage(damage, knockbackX = 0, stunDuration = 0.2, attackerForm = null) {
        // フォームによる防御力システム / Defense system based on form
        // 攻撃者のフォームと自分のフォームの差で軽減率が変わる / Reduction rate changes based on form difference
        if (attackerForm) {
            const formDifference = this.form.id - attackerForm.id;

            if (formDifference > 0) {
                // 自分のフォームが高い場合、1段階につき10%軽減 / 10% reduction per form level difference
                const reductionPercent = Math.min(formDifference * 10, 80); // 最大80%軽減 / Max 80% reduction
                damage *= (1 - reductionPercent / 100);
            } else if (formDifference < 0) {
                // 自分のフォームが低い場合、1段階につき5%増加 / 5% increase per form level difference
                const increasePercent = Math.abs(formDifference) * 5;
                damage *= (1 + increasePercent / 100);
            }
            // 同じフォームの場合は通常ダメージ / Normal damage if same form
        }

        // 基本的なフォーム防御ボーナス (1防御につき2%軽減) / Basic form defense bonus (2% per defense point)
        const baseDefenseReduction = 1 - (this.form.defenseBonus * 0.02);
        damage *= baseDefenseReduction;

        if (this.isGuarding) {
            damage *= 0.3; // ガード時は70%軽減 / 70% damage reduction when guarding
            knockbackX *= 0.5;
            stunDuration *= 0.5;
        }

        this.hp = Math.max(0, this.hp - damage);
        this.vx += knockbackX;
        this.stunTimer = stunDuration;
        this.isStunned = true;
    }

    // 攻撃実行 / Execute attack
    attack(attackType, projectiles) {
        // クールダウン中 / On cooldown
        if (this.attackCooldowns[attackType] > 0) return null;

        // スタン中や硬直中 / Stunned or in startup lag
        if (this.isStunned || this.startupLagTimer > 0) return null;

        const attackData = ATTACK_DATA[attackType];

        // スタミナ不足 / Insufficient stamina
        if (this.stamina < attackData.staminaCost) return null;

        // Genkidama特殊条件 / Genkidama special requirement
        if (attackType === 'genkidama') {
            const staminaPercent = (this.stamina / this.maxStamina) * 100;
            if (staminaPercent < 90) return null;
        }

        // Punch（近接攻撃） / Punch (melee attack)
        if (attackType === 'punch') {
            this.stamina -= attackData.staminaCost;
            this.attackCooldowns[attackType] = attackData.cooldown;
            this.startupLagTimer = attackData.startupLag;
            return {
                type: 'melee',
                damage: attackData.baseDamage + this.form.punchBonus,
                range: attackData.range,
                knockback: attackData.knockback,
                stunDuration: attackData.hitStun
            };
        }

        // 飛び道具攻撃 / Projectile attacks
        if (attackData.isProjectile) {
            this.stamina -= attackData.staminaCost;
            this.attackCooldowns[attackType] = attackData.cooldown;
            this.startupLagTimer = attackData.startupLag;

            let damage = attackData.baseDamage;
            if (attackType === 'blast') damage += this.form.blastBonus;
            else if (attackType === 'kamehameha') damage += this.form.kameBonus;
            else if (attackType === 'genkidama') damage += this.form.genkiBonus;

            // Kamehamehaのチャージ倍率 / Kamehameha charge multiplier
            if (attackType === 'kamehameha' && this.kamehamehaChargeTime > 0) {
                const chargeRatio = Math.min(this.kamehamehaChargeTime / attackData.maxChargeTime, 1);
                damage *= (1 + chargeRatio * (attackData.chargeDamageMultiplier - 1));
                this.kamehamehaChargeTime = 0;
            }

            const projectile = new Projectile(
                this.x + this.facing * 40,
                this.y - 30,
                this.facing,
                attackType,
                this,
                damage
            );

            projectiles.push(projectile);

            // Genkidamaの特別な硬直 / Genkidama special lag
            if (attackType === 'genkidama') {
                this.startupLagTimer = attackData.startupLag;
            }

            return projectile;
        }

        return null;
    }

    // 更新 / Update
    update(deltaTime, input, otherPlayer, projectiles) {
        // クールダウン更新 / Update cooldowns
        for (let key in this.attackCooldowns) {
            if (this.attackCooldowns[key] > 0) {
                this.attackCooldowns[key] = Math.max(0, this.attackCooldowns[key] - deltaTime);
            }
        }

        // スタン・硬直タイマー / Stun and lag timers
        if (this.stunTimer > 0) {
            this.stunTimer = Math.max(0, this.stunTimer - deltaTime);
            if (this.stunTimer === 0) this.isStunned = false;
        }

        if (this.startupLagTimer > 0) {
            this.startupLagTimer = Math.max(0, this.startupLagTimer - deltaTime);
        }

        // 動けない状態 / Can't move
        if (this.isStunned || this.startupLagTimer > 0) {
            // 重力のみ適用 / Apply gravity only
            if (!this.isGrounded) {
                this.vy += this.gravity * deltaTime;
            }
            this.applyPhysics(deltaTime);
            return;
        }

        // リセット状態 / Reset state
        this.isCharging = false;
        this.isGuarding = false;
        this.chargingKamehameha = false;

        // Kiチャージ / Charge Ki
        if (input.charge) {
            this.chargeKi(deltaTime);
            this.vx = 0; // チャージ中は動けない / Can't move while charging
        }
        // ガード / Guard
        else if (input.guard) {
            this.isGuarding = true;
            this.vx = 0;
        }
        // 移動と攻撃 / Movement and attacks
        else {
            // 水平移動 / Horizontal movement
            if (input.left) {
                this.vx = -this.moveSpeed;
                this.facing = -1;
            } else if (input.right) {
                this.vx = this.moveSpeed;
                this.facing = 1;
            } else {
                this.vx = 0;
            }

            // 垂直移動（飛行） / Vertical movement (flying)
            if (input.up && this.isGrounded) {
                // 地上でのジャンプ（スタミナ不要） / Jump from ground (no stamina required)
                this.vy = -this.jumpPower;
                this.isGrounded = false;
                this.isFlying = false;
            } else if (input.up && !this.isGrounded && this.stamina > 0) {
                // 空中での上昇飛行（スタミナ必要） / Flying upward in air (stamina required)
                this.isFlying = true;
                this.vy = -this.flySpeed;
                // 飛行時のスタミナ消費 / Stamina consumption while flying
                this.stamina = Math.max(0, this.stamina - 1 * deltaTime * 60);
            } else if (input.down && !this.isGrounded && this.stamina > 0) {
                // 空中での下降飛行（スタミナ必要） / Flying downward in air (stamina required)
                this.isFlying = true;
                this.vy = this.flySpeed;
                this.stamina = Math.max(0, this.stamina - 1 * deltaTime * 60);
            } else {
                // スタミナがない場合は飛行停止 / Stop flying if no stamina
                this.isFlying = false;
            }

            // 攻撃入力 / Attack input
            if (input.punch) {
                const meleeAttack = this.attack('punch', projectiles);
                if (meleeAttack) {
                    this.checkMeleeHit(otherPlayer, meleeAttack);
                }
            } else if (input.blast) {
                this.attack('blast', projectiles);
            } else if (input.kamehameha) {
                // Kamehamehaチャージ / Kamehameha charge
                this.chargingKamehameha = true;
                const attackData = ATTACK_DATA.kamehameha;
                this.kamehamehaChargeTime = Math.min(
                    this.kamehamehaChargeTime + deltaTime,
                    attackData.maxChargeTime
                );

                // 最小チャージ達成で発射可能 / Can fire after minimum charge
                if (this.kamehamehaChargeTime >= attackData.minChargeTime) {
                    // キーを離したら発射（次フレームで実装） / Fire on release (implement next frame)
                }
            } else if (this.kamehamehaChargeTime > 0) {
                // キーが離された→発射 / Key released → Fire
                this.attack('kamehameha', projectiles);
            } else if (input.genkidama) {
                this.attack('genkidama', projectiles);
            }

            // 進化 / Evolution
            if (input.evolve && this.canEvolve) {
                this.evolve();
            }
        }

        // 重力適用（飛行中でなければ） / Apply gravity (if not flying)
        if (!this.isFlying && !this.isGrounded) {
            this.vy += this.gravity * deltaTime;
        }

        // 物理演算適用 / Apply physics
        this.applyPhysics(deltaTime);

        // 相手の方を向く / Face opponent
        if (otherPlayer) {
            if (otherPlayer.x > this.x) {
                this.facing = 1;
            } else if (otherPlayer.x < this.x) {
                this.facing = -1;
            }
        }
    }

    // 近接攻撃の当たり判定 / Melee hit detection
    checkMeleeHit(target, attackData) {
        const distance = Math.abs(this.x - target.x);
        if (distance <= attackData.range) {
            const knockbackDirection = this.facing * attackData.knockback;
            target.takeDamage(attackData.damage, knockbackDirection, attackData.stunDuration, this.form);
        }
    }

    // 物理演算 / Physics
    applyPhysics(deltaTime) {
        // 位置更新 / Update position
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // 地面判定 / Ground check
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.vy = 0;
            this.isGrounded = true;
            this.isFlying = false;
        } else {
            this.isGrounded = false;
        }

        // 画面端制限 / Screen bounds
        this.x = Math.max(30, Math.min(1250, this.x));

        // 上限制限 / Upper bound
        this.y = Math.max(50, this.y);

        // 速度減衰 / Velocity damping
        this.vx *= 0.9;
    }

    // 描画 / Draw
    draw(ctx) {
        ctx.save();

        // キャラクター本体（簡易表現） / Character body (simplified)
        ctx.fillStyle = this.form.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.form.color;

        // 体 / Body
        ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height,
            this.width,
            this.height
        );

        // チャージエフェクト / Charge effect
        if (this.isCharging || this.chargingKamehameha) {
            ctx.strokeStyle = this.form.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y - this.height / 2, this.width, 0, Math.PI * 2);
            ctx.stroke();
        }

        // ガードエフェクト / Guard effect
        if (this.isGuarding) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y - this.height / 2, this.width + 10, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }
}
