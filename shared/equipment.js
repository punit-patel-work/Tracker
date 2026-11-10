export function equipmentTags(e) {
  const content = (e.equipment + ' ' + e.name).toLowerCase();
  const tags = [];
  for (const [tag, re] of Object.entries({
    dumbbell: /dumbbell/, barbell: /barbell|ez.bar|trap.bar/, cable: /cable/,
    machine: /machine|selectorized|plate.loaded/, smith: /smith/, band: /band/,
    kettlebell: /kettlebell/, suspension: /suspension|trx/, bench: /bench/,
    pullup_bar: /pull.up|chin.up|hanging|dead.hang/, ball: /stability.ball|swiss.ball/,
  })) if (re.test(content)) tags.push(tag);
  if (tags.includes('smith') && tags.includes('machine')) tags.splice(tags.indexOf('machine'),1);
  if (!tags.length && (e.isBodyweight || /bodyweight|none|floor|mat/.test(content))) tags.push('bodyweight');
  if (!tags.length) tags.push('other');
  return [...new Set(tags)];
}
export function available(e, equipment) {
  return equipment.includes('full_gym') || equipmentTags(e).every(t => t === 'bodyweight' || equipment.includes(t));
}
