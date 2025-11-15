// 32形態データ定義 / 32 Forms Data Definition
const FORMS = [
    // Tier 1 (1-8) - 第1段
    { id: 1, name: "ベースフォーム", tier: 1, color: "#ffffff", hpBonus: 0, staminaBonus: 0, punchBonus: 0, blastBonus: 0, kameBonus: 0, genkiBonus: 0, defenseBonus: 0 },
    { id: 2, name: "超サイヤ人", tier: 1, color: "#ffff00", hpBonus: 25, staminaBonus: 100, punchBonus: 5, blastBonus: 3, kameBonus: 3, genkiBonus: 10, defenseBonus: 1 },
    { id: 3, name: "超サイヤ人2", tier: 1, color: "#ffff66", hpBonus: 60, staminaBonus: 200, punchBonus: 10, blastBonus: 6, kameBonus: 6, genkiBonus: 20, defenseBonus: 2 },
    { id: 4, name: "超サイヤ人3", tier: 1, color: "#ffff33", hpBonus: 105, staminaBonus: 300, punchBonus: 15, blastBonus: 9, kameBonus: 9, genkiBonus: 30, defenseBonus: 3 },
    { id: 5, name: "超サイヤ人ゴッド", tier: 1, color: "#ff3366", hpBonus: 160, staminaBonus: 400, punchBonus: 20, blastBonus: 12, kameBonus: 12, genkiBonus: 40, defenseBonus: 4 },
    { id: 6, name: "超サイヤ人ブルー", tier: 1, color: "#3366ff", hpBonus: 225, staminaBonus: 500, punchBonus: 25, blastBonus: 15, kameBonus: 15, genkiBonus: 50, defenseBonus: 5 },
    { id: 7, name: "超サイヤ人ブルー進化", tier: 1, color: "#0044ff", hpBonus: 300, staminaBonus: 600, punchBonus: 30, blastBonus: 18, kameBonus: 18, genkiBonus: 60, defenseBonus: 6 },
    { id: 8, name: "超サイヤ人4", tier: 1, color: "#ff0066", hpBonus: 385, staminaBonus: 700, punchBonus: 35, blastBonus: 21, kameBonus: 21, genkiBonus: 70, defenseBonus: 7 },

    // Tier 2 (9-16) - 第2段
    { id: 9, name: "超サイヤ人ゴッド2", tier: 2, color: "#ff6699", hpBonus: 480, staminaBonus: 800, punchBonus: 40, blastBonus: 24, kameBonus: 24, genkiBonus: 80, defenseBonus: 8 },
    { id: 10, name: "超サイヤ人ブルー2", tier: 2, color: "#6699ff", hpBonus: 585, staminaBonus: 900, punchBonus: 45, blastBonus: 27, kameBonus: 27, genkiBonus: 90, defenseBonus: 9 },
    { id: 11, name: "超サイヤ人ブルー進化2", tier: 2, color: "#3366cc", hpBonus: 700, staminaBonus: 1000, punchBonus: 50, blastBonus: 30, kameBonus: 30, genkiBonus: 100, defenseBonus: 10 },
    { id: 12, name: "超サイヤ人4.5", tier: 2, color: "#ff3399", hpBonus: 825, staminaBonus: 1100, punchBonus: 55, blastBonus: 33, kameBonus: 33, genkiBonus: 110, defenseBonus: 11 },
    { id: 13, name: "超サイヤ人ゴッド3", tier: 2, color: "#ff0033", hpBonus: 960, staminaBonus: 1200, punchBonus: 60, blastBonus: 36, kameBonus: 36, genkiBonus: 120, defenseBonus: 12 },
    { id: 14, name: "超サイヤ人ブルー3", tier: 2, color: "#0033ff", hpBonus: 1105, staminaBonus: 1300, punchBonus: 65, blastBonus: 39, kameBonus: 39, genkiBonus: 130, defenseBonus: 13 },
    { id: 15, name: "超サイヤ人ブルー進化3", tier: 2, color: "#0066cc", hpBonus: 1260, staminaBonus: 1400, punchBonus: 70, blastBonus: 42, kameBonus: 42, genkiBonus: 140, defenseBonus: 14 },
    { id: 16, name: "超サイヤ人4フルパワー", tier: 2, color: "#cc0066", hpBonus: 1425, staminaBonus: 1500, punchBonus: 75, blastBonus: 45, kameBonus: 45, genkiBonus: 150, defenseBonus: 15 },

    // Tier 3 (17-24) - 第3段
    { id: 17, name: "超サイヤ人ローズ", tier: 3, color: "#ff66cc", hpBonus: 1600, staminaBonus: 1600, punchBonus: 80, blastBonus: 48, kameBonus: 48, genkiBonus: 160, defenseBonus: 16 },
    { id: 18, name: "伝説の超サイヤ人", tier: 3, color: "#00ff66", hpBonus: 1785, staminaBonus: 1700, punchBonus: 85, blastBonus: 51, kameBonus: 51, genkiBonus: 170, defenseBonus: 17 },
    { id: 19, name: "超サイヤ人パープル", tier: 3, color: "#9933ff", hpBonus: 1980, staminaBonus: 1800, punchBonus: 90, blastBonus: 54, kameBonus: 54, genkiBonus: 180, defenseBonus: 18 },
    { id: 20, name: "超サイヤ人ローズ2", tier: 3, color: "#ff33cc", hpBonus: 2185, staminaBonus: 1900, punchBonus: 95, blastBonus: 57, kameBonus: 57, genkiBonus: 190, defenseBonus: 19 },
    { id: 21, name: "伝説の超サイヤ人2", tier: 3, color: "#33ff66", hpBonus: 2400, staminaBonus: 2000, punchBonus: 100, blastBonus: 60, kameBonus: 60, genkiBonus: 200, defenseBonus: 20 },
    { id: 22, name: "超サイヤ人パープル2", tier: 3, color: "#cc33ff", hpBonus: 2625, staminaBonus: 2100, punchBonus: 105, blastBonus: 63, kameBonus: 63, genkiBonus: 210, defenseBonus: 21 },
    { id: 23, name: "超サイヤ人ローズ3", tier: 3, color: "#ff00cc", hpBonus: 2860, staminaBonus: 2200, punchBonus: 110, blastBonus: 66, kameBonus: 66, genkiBonus: 220, defenseBonus: 22 },
    { id: 24, name: "伝説の超サイヤ人3", tier: 3, color: "#00ff33", hpBonus: 3105, staminaBonus: 2300, punchBonus: 115, blastBonus: 69, kameBonus: 69, genkiBonus: 230, defenseBonus: 23 },

    // Tier 4 (25-32) - 第4段
    { id: 25, name: "超サイヤ人パープル3", tier: 4, color: "#9900ff", hpBonus: 3360, staminaBonus: 2400, punchBonus: 120, blastBonus: 72, kameBonus: 72, genkiBonus: 240, defenseBonus: 24 },
    { id: 26, name: "超サイヤ人ヒール", tier: 4, color: "#00ffff", hpBonus: 3625, staminaBonus: 2500, punchBonus: 125, blastBonus: 75, kameBonus: 75, genkiBonus: 250, defenseBonus: 25 },
    { id: 27, name: "ビースト", tier: 4, color: "#979797ff", hpBonus: 3900, staminaBonus: 2600, punchBonus: 130, blastBonus: 78, kameBonus: 78, genkiBonus: 260, defenseBonus: 26 },
    { id: 28, name: "我儘の極意", tier: 4, color: "#cc00ff", hpBonus: 4185, staminaBonus: 2700, punchBonus: 135, blastBonus: 81, kameBonus: 81, genkiBonus: 270, defenseBonus: 27 },
    { id: 29, name: "超サイヤ人5", tier: 4, color: "#e7e7e7ff", hpBonus: 4480, staminaBonus: 2800, punchBonus: 140, blastBonus: 84, kameBonus: 84, genkiBonus: 280, defenseBonus: 28 },
    { id: 30, name: "超サイヤ人6", tier: 4, color: "#fbff00ff", hpBonus: 4785, staminaBonus: 2900, punchBonus: 145, blastBonus: 87, kameBonus: 87, genkiBonus: 290, defenseBonus: 29 },
    { id: 31, name: "身勝手の極意", tier: 4, color: "#ccccff", hpBonus: 5100, staminaBonus: 3000, punchBonus: 150, blastBonus: 90, kameBonus: 90, genkiBonus: 300, defenseBonus: 30 },
    { id: 32, name: "身勝手の極意3", tier: 4, color: "#ffffff", hpBonus: 5425, staminaBonus: 3200, punchBonus: 160, blastBonus: 96, kameBonus: 96, genkiBonus: 320, defenseBonus: 32 }
];

// 形態取得関数 / Get form by ID
function getFormById(id) {
    return FORMS.find(form => form.id === id) || FORMS[0];
}

// 次の形態を取得 / Get next form
function getNextForm(currentFormId) {
    if (currentFormId >= 32) return null; // 最大形態 / Max form reached
    return FORMS[currentFormId]; // 配列は0始まりなので currentFormId が次のインデックス / Array is 0-indexed
}
