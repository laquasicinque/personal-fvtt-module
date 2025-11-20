// Replace Activity Icons with slightly nicer ones
Hooks.once("init", () => {
  const activityIcons = {
    attack:   "icons/skills/melee/strike-sword-steel-yellow.webp",
    cast:     "icons/magic/fire/flame-burning-hand-orange.webp",
    check:    "icons/skills/social/peace-luck-insult.webp",
    damage:   "icons/magic/fire/flame-burning-embers-orange.webp",
    enchant:  "icons/magic/symbols/runes-etched-steel-blade.webp",
    forward:  "icons/magic/movement/trail-streak-zigzag-teal.webp",
    heal:     "icons/magic/life/cross-explosion-burst-green.webp",
    save:     "icons/magic/light/beam-impact-deflect-teal.webp",
    summon:   "icons/magic/movement/chevrons-down-yellow.webp",
    transform:"icons/creatures/mammals/bull-horns-eyes-glowin-orange.webp",
    utility:  "icons/tools/hand/lockpicks-steel-grey.webp",
  };

  // Apply icons to activityTypes
  for (const [key, img] of Object.entries(activityIcons)) {
    const activity = CONFIG.DND5E.activityTypes[key];
    activity.documentClass.metadata.img = img
  }
});

// Auto expand player character folders
document.addEventListener('click', (e) => {
    const folderEl = e.target.closest('li.directory-item.folder')
    const entry = e.target.closest('li.directory-item.entry')
    if (!folderEl || entry) return

    const isExpanded = folderEl.classList.contains('expanded')
    if (!isExpanded) return

    const folderId = folderEl.dataset.folderId
    const folder = game.folders.get(folderId)
    const isPlayerFolder = !!folder.getParentFolders().find(folder => folder.name === 'Player Characters')
    if (!isPlayerFolder) return

    const charFolder = folder.children.find(child => child.folder.name === 'Characters')
    if (!charFolder) return

    const charFolderEl = folderEl.querySelector(`li.directory-item.folder[data-folder-id="${charFolder.folder.id}"]`)
    game.folders._expanded[charFolder.folder.id] = true
    charFolderEl.classList.add('expanded')
})

Hooks.on("midi-qol.AttackRollComplete", async (workflow) => {
  const { item } = workflow
  if (!item.system.properties.has('misfire') || item.flags.naito.misfire == null) return

  if (!workflow.isFumble) return
  const jamActivityId = 'Actor.mMhS6HltdIF1hmYz.Item.OZtdJxGw7RDslZgi.Activity.YhwjRS64cgKLInaT'
  const enc = fromUuidSync(jamActivityId)
  const {message} = await enc.use({},{}, { whisper: [game.users.activeGM.id]} )
  for (const effect of enc.effects) {
    enc.applyEnchantment(effect._id, item, { chatMessage: message })
  }
})
