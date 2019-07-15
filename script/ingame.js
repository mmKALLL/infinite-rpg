
(function () {
  let gs = {
    level: 1,
    xp: 0,
    gold: 0,
    equipment: {
      weapon: {
        power: 1,
        name: 'ボロい枝'
      },
      armor: {
        power: 1,
        name: 'ボロい服'
      },
    },
    questsDone: 0,
    trainingDone: 0,
    get xpToNextLevel() { return Math.floor(99 + gs.level * gs.level * 1.5001) },
    get attack() { return gs.level + gs.equipment.weapon.power },
    get defense() { return Math.floor(gs.level * 0.2 + gs.equipment.armor.power) },
    get maxHP() { return Math.floor(15 + Math.pow(gs.level, 1.3) * 5) },
    HP: 20,

    frames: 0,
    state: 'none',
    currentActionDone: 0,
    currentActionMax: 1,

    quest: {
      name: 'none',
      boss: {
        name: '',
        maxHP: 0,
        HP: 0,
        attack: 0,
        defense: 0,
      },
      equipment: {
      }
    }
  }



  function startTraining() {
    gs.state = 'training'
    gs.currentActionDone = 0
    gs.currentActionMax = (2.4 - 0.17 * Math.pow(Math.min(110, gs.level + 10), 0.5)) * 10 // 10 = 1s
  }
  document.getElementById("train-button").addEventListener("click", startTraining);

  function finishTraining() {
    gs.xp += 5 + Math.floor((0.8 + Math.random()) * (gs.level + 10) * 1.6)
    gs.trainingDone += 1
    startTraining()
  }

  function startAdventure() {
    if (gs.quest.name === 'none') {
      addStoryText('無意味で死ぬのは勿体無い！\n街の外は危険すぎるのでまずはクエストを見つけましょう🎵')
    } else {
      gs.state = 'adventure'
      gs.currentActionDone = 0
      gs.currentActionMax = 1
    }
  }
  document.getElementById("adventure-button").addEventListener("click", startAdventure);

  function startGettingQuest() {
    gs.state = 'get-quest'
    gs.currentActionDone = 0
    gs.currentActionMax = (0.5 + (0.13 * gs.questsDone * Math.random())) * 10 // 10 = 1s
    addStoryText(`町のクエスト看板へ向かった、何かあるかな・・・`)
  }
  document.getElementById("quest-button").addEventListener("click", startGettingQuest);

  function getQuest() {
    gs.state = 'none'
    gs.currentActionDone = 0
    gs.currentActionMax = 1
    if (gs.quest.name === 'none' || gs.frames - gs.quest.startTime > 200) {
      gs.quest = generateQuest()
      addStoryText(`${gs.quest.name}を受けました`)
    } else {
      addStoryText(`新しいクエストはまだ見つかりませんでした。後ほど改めて探してみてください。`)
    }
  }

  function generateQuest() {
    const questName = generateQuestName()
    const maxHP = Math.floor(7 + Math.pow(gs.questsDone, 1.4) * (0.12 + Math.random()) * 22)
    const attack = Math.floor(3 + Math.pow(gs.questsDone, 1.2) * (0.1 + Math.random()) * 5.8)
    const defense = Math.floor(1 + Math.pow(gs.questsDone, 0.9) * (0.05 + Math.random()) * 1.1)
    return {
      name: questName,
      startTime: gs.frames,
      boss: {
        maxHP: maxHP,
        HP: maxHP,
        attack: attack,
        defense: defense,
      },
      equipment: generateEquipment(attack, defense),
    }
  }

  function capIndexToArray(array, index) {
    return Math.min(array.length - 1, Math.max(0, Math.floor(index)))
  }

  function generateEquipment(attack, defense) {
    const trueAttack = Math.max(1, attack - Math.pow(gs.questsDone, 0.7) * 1.0)
    const trueDefense = Math.max(1, defense - Math.pow(gs.questsDone, 0.3) * 0.)

    const adjectives = ['ボロい', '普通の', '綺麗な', '丈夫な', '切れやすい', '素晴らしい', 'マスターワークの', '伝説的な']
    const weapons = ['枝', '竹刀', 'ナイフ', '斧', '刀', '剣', '政宗', 'エクスカリバー']
    const armors = ['服', 'スーツ', 'レザーアーマー', 'チェインメール', 'プレートメール', '甲冑']


    const weaponLevel = capIndexToArray(adjectives, (Math.random() + (Math.pow(trueAttack / 10, 0.2))) * Math.random() * adjectives.length)
    const weaponIndex = capIndexToArray(weapons, trueAttack / (Math.pow(weaponLevel + 1, 0.9)) * (0.3 + Math.random()))
    const weaponAttack = Math.ceil(Math.pow((weaponLevel + 1), 1.0) * Math.pow((weaponIndex + 1), 2.3))

    const armorLevel = capIndexToArray(adjectives, (Math.random() + 0.1) * Math.random() * adjectives.length)
    const armorIndex = capIndexToArray(armors, trueDefense / (Math.pow(armorLevel + 1, 0.5)) * (0.1 + Math.random()))
    const armorDefense = Math.ceil(Math.pow((armorLevel + 1), 0.7) * Math.pow((armorIndex + 1), 1.4))

    const weaponName = `${adjectives[weaponLevel]}${weapons[weaponIndex]}`
    const armorName = `${adjectives[armorLevel]}${armors[armorIndex]}`

    console.log(weaponName, weaponLevel, weaponIndex, weaponAttack, '\n' + armorName, armorLevel, armorIndex, armorDefense)
    return {
      weapon: {
        power: weaponAttack,
        name: weaponName,
      },
      armor: {
        power: armorDefense,
        name: armorName,
      },
    }
  }

  // Gets a random element from provided array.
  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  function generateQuestName() {
    adjectives = ['恐ろしい', '怖がる', 'でっけー', 'ヤバそうな', 'ボロい', '強そうな', '美的な']
    objects = ['くま', '狼', '人狼', '幽霊', '死神', 'ボス的', '吸血鬼', '鬼', '蜘蛛', '殺人', '暗殺者']
    verbs = ['の暗殺', 'の殺し', 'を納得させる', 'と取引する', 'を平和にする', 'を反省させる']
    return `${getRandomItem(adjectives)}${getRandomItem(objects)}${getRandomItem(verbs)}クエスト`
  }

  function finishQuest() {
    const xpGained = 50 + (50 * gs.questsDone)
    gs.xp += xpGained
    gs.questsDone += 1
    gs.state = 'none'
    getQuestEquipment(gs.quest.equipment)
    addStoryText(`大変恐ろしい敵を倒して${xpGained}XPをもらった\n敵の${equipmentToNames(gs.quest.equipment)}を持って帰りました`)
    gs.quest.name = 'none'
  }

  function getQuestEquipment(newEquipment) {
    const originalEquipment = { ...gs.equipment } // shallow copy
    const soldEquipment = {}
    let newGold = 0

    Object.keys(originalEquipment).forEach(key => {
      if (gs.equipment[key].power < newEquipment[key].power) {
        soldEquipment[key] = gs.equipment[key]
        newGold += equipmentValue(key, gs.equipment[key].power)
        gs.equipment[key] = newEquipment[key]
      } else {
        soldEquipment[key] = newEquipment[key]
        newGold += equipmentValue(key, newEquipment[key].power)
      }
    });

    gs.gold += newGold
    addStoryText(`もってる道具をみて、 ${equipmentToNames(soldEquipment)}、 を売ることにしました\nそれでもらえた何もに使えない${newGold}円を寄付しました`)
    if (newGold > 10000) {
      addStoryText(`町のために頑張ってくださって、みんなすごく喜んでます`)
    }
  }

  function equipmentValue(type, power) {
    const typeMultipliers = {
      'weapon': 0.8,
      'armor': 5,
    }

    return Math.ceil(Math.pow(power, 2) * typeMultipliers[type] * (0.5 + Math.random()))
  }

  function equipmentToNames(equips, separator = '、') {
    return Object.keys(equips).map(key => equips[key].name).join(separator)
  }





  function update() {
    gs.frames += 1
    if (gs.frames % 10 === 0) {
      gs.HP = Math.min(gs.maxHP, Math.floor(gs.HP + gs.maxHP / 20))
    }

    if (gs.state === 'training') {
      gs.currentActionDone += 1
      if (gs.currentActionDone >= gs.currentActionMax) {
        finishTraining()
      }
    }

    if (gs.state === 'adventure' && gs.quest.name !== 'none') {
      gs.HP -= Math.ceil(gs.quest.boss.attack / gs.defense)
      gs.quest.boss.HP -= Math.ceil(gs.attack / gs.quest.boss.defense)
      if (gs.quest.boss.HP <= 0) {
        finishQuest()
      }
    }

    if (gs.state === 'get-quest') {
      gs.currentActionDone += 1
      if (gs.currentActionDone >= gs.currentActionMax) {
        getQuest()
      }

    }

    if (gs.xp >= gs.xpToNextLevel) {
      levelUp()
    }

    if (gs.HP <= 0) {
      clearInterval(updateInterval)
      gameOver()
    }

  }

  const updateInterval = setInterval(update, 100)
  setInterval(draw, 10)
  startGame()

  function levelUp() {
    gs.xp -= gs.xpToNextLevel
    gs.level += 1
    addStoryText(`🎉✨＼テレテレー！！／✨🎉\nレベル＿${gs.level}＿にレベルアップしました！`)
    if (gs.level === 100) {
      endGame()
    }
  }

  function startGame() {
    addStoryText('ボロい服と枝を装備して、町のトレーニング場へ向かいましょう・・・')
    addStoryText('いつかレベル100まで上がれる夢を見て、\n伝説的な冒険者になりたいあなたは\n無限なアドベンチャーへ出かけます')
    addStoryText('✨✨✨無限RPGへようこそ！✨✨✨')
  }

  // Game ends due to HP reaching 0
  function gameOver() {
    window.alert(`ゲームオーバーです。あなたは人生で${gs.gold}円の価値を得られました。ご苦労様です。よく頑張ったね。また遊びに来てください。\n\nMade by Studio Esagames, 2019.`)
    window.location.replace('./index.html')
  }

  // Game ends because of all goals being achieved
  function endGame() {
    window.alert('一筆啓上い致し候\n\nあなたは町の皆様を救って大変明朗的な人間です。この冒険の伝説はいつまでもお祝いしましょう。あなたほど努力のある方は人生に見たことがない。あなたは素晴らしい。あなたを愛している。大変お疲れ様でした。これからも続くことはできますが、そろそろ休憩しましょう。僕のゲームをここまで楽しんでいただいて、恐悦至極に存じます。\n\n興味があればゲームと人生のことを話しましょう。mmKALLLで検索すれば見つかります。\n\nエサより')
  }

  function addStoryText(text) {
    const wrapper = document.getElementById('story-text-wrapper')
    const element = document.createElement('div')
    element.className = 'story-text'
    element.innerText = text
    wrapper.prepend(element)
  }

  function createProgressBar(elem, label, value, max, barLength = 30, character = '@') {
    let progressPoints = Math.ceil(Math.max(0, Math.min(value, max)) / (max + 0.01) * barLength)
    elem.innerHTML = `${label}<pre>【${character.repeat(progressPoints)}${' '.repeat(barLength - progressPoints)}】</pre>`
  }

  function draw() {
    createProgressBar(document.getElementById('level'), `レベル：${gs.level}&ensp;`, gs.level, 100, 20, '+')
    createProgressBar(document.getElementById('xp'), `XP：${gs.xp} / ${gs.xpToNextLevel} `, gs.xp, gs.xpToNextLevel, 20, '@')
    createProgressBar(document.getElementById('HP'), `HP：${gs.HP} / ${gs.maxHP} `, gs.HP, gs.maxHP, 20, '♡')
    document.getElementById('attack').innerText = `武器名：${gs.equipment.weapon.name}\n攻撃力：${gs.attack}`
    document.getElementById('defense').innerText = `防具名：${gs.equipment.armor.name}\n暴挙力：${gs.defense}`
    if (gs.gold > 0) document.getElementById('gold').innerText = `棋譜した金額：${gs.gold}円`
    if (gs.questsDone > 0) document.getElementById('quests-done').innerText = `クリアしたクエスト：${gs.questsDone}`

    document.getElementById('quest-name').innerText = `${gs.quest.name === 'none' ? 'クエスト受けてない' : gs.quest.name}`
    if (gs.quest.name === 'none' && gs.questsDone === 0) {

    } else {
      createProgressBar(document.getElementById('boss-hp'), `敵HP： ${gs.quest.boss.HP} / ${gs.quest.boss.maxHP} `, gs.quest.boss.HP, gs.quest.boss.maxHP, 20, '♥')
      document.getElementById('boss-attack').innerText = `敵ATK：${gs.quest.boss.attack}`
      document.getElementById('boss-defense').innerText = `敵DEF：${gs.quest.boss.defense}`
    }

    createProgressBar(document.getElementById('progress-bar'), 'アクション：', gs.currentActionDone, gs.currentActionMax, 30)
    // TODO: fancy bar

  window.infiniteRPGdebug = (val) => gs = { ...gs, ...val }
  }
})();
