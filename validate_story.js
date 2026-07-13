// This script uses the actual TS code via ts-node/register or by building a quick checker
// Since we can't run TS directly, let's do a more careful regex-based check

const fs = require('fs');
const path = require('path');

const storyDir = path.join(__dirname, 'src/data/stories');

function parseFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const nodes = [];
  // Node blocks are separated by 'export const' or array entries
  // Let's split by finding all id: 'chX_*' patterns and tracking context
  const nodeIdRegex = /id:\s*['"](ch\d_[^'"]+)['"]/g;
  let m;
  const nodePositions = [];
  while ((m = nodeIdRegex.exec(content)) !== null) {
    nodePositions.push({ id: m[1], start: m.index });
  }

  for (let i = 0; i < nodePositions.length; i++) {
    const pos = nodePositions[i];
    const end = i + 1 < nodePositions.length ? nodePositions[i + 1].start : content.length;
    const block = content.substring(pos.start, end);

    const nextMatch = block.match(/(?:^|[^a-zA-Z])(?:next|nextNode):\s*['"](ch\d_[^'"]+)['"]/);
    // For choices, look for choice blocks
    const choiceNextNodes = [];
    const choicesBlockMatch = block.match(/choices\s*:\s*\[([\s\S]*?)\]\s*,?\s*(?:effects|defaultOption|\}|\n\s*\},|\n\s*\{)/);
    if (choicesBlockMatch) {
      const choiceBlock = choicesBlockMatch[1];
      const cnextRegex = /nextNode:\s*['"](ch\d_[^'"]+)['"]/g;
      let cm;
      while ((cm = cnextRegex.exec(choiceBlock)) !== null) {
        choiceNextNodes.push(cm[1]);
      }
    }

    // Check for effects that trigger endings (type:'ending' or flag: ending_*)
    const hasEndingEffect = /type:\s*['"]ending['"]/m.test(block) ||
      /target:\s*['"]ending_[^'"]+['"]/m.test(block);

    // Check for enemyId
    const enemyMatch = block.match(/enemyId:\s*['"]([^'"]+)['"]/);

    // Check if it's a battle node
    const isBattle = /type:\s*['"]battle['"]/m.test(block);

    nodes.push({
      id: pos.id,
      next: nextMatch ? nextMatch[1] : null,
      choiceNexts: choiceNextNodes,
      hasEndingEffect,
      isBattle,
      enemyId: enemyMatch ? enemyMatch[1] : null,
      hasChoices: choiceNextNodes.length > 0 || /choices\s*:/.test(block),
    });
  }
  return nodes;
}

const ch1 = parseFile(path.join(storyDir, 'chapter1.ts'));
const ch2 = parseFile(path.join(storyDir, 'chapter2.ts'));
const ch3 = parseFile(path.join(storyDir, 'chapter3.ts'));
const allNodesList = [...ch1, ...ch2, ...ch3];
const allIds = new Set(allNodesList.map(n => n.id));

console.log('=== 节点统计 ===');
console.log('Ch1:', ch1.length, '| Ch2:', ch2.length, '| Ch3:', ch3.length, '| 总计:', allIds.size);

// 1. Dead links
console.log('\n=== ❶ 死链检测 ===');
const deadLinks = [];
for (const n of allNodesList) {
  if (n.next && !allIds.has(n.next)) deadLinks.push(`${n.id} --next--> ${n.next}`);
  for (const cn of n.choiceNexts) {
    if (!allIds.has(cn)) deadLinks.push(`${n.id} --choice--> ${cn}`);
  }
}
if (deadLinks.length === 0) console.log('✓ 无死链');
else deadLinks.forEach(d => console.log('✗', d));

// 2. Unreachable nodes (no one points to them) - except start
console.log('\n=== ❷ 孤立节点检测（从未被next/choice引用）===');
const targeted = new Set();
for (const n of allNodesList) {
  if (n.next) targeted.add(n.next);
  n.choiceNexts.forEach(c => targeted.add(c));
}
const unreachable = [...allIds].filter(id => !targeted.has(id) && id !== 'ch1_prologue_001');
if (unreachable.length === 0) console.log('✓ 无孤立节点');
else {
  console.log(`发现 ${unreachable.length} 个未被引用的节点:`);
  unreachable.forEach(u => console.log('  ⚠', u));
}

// 3. Terminal nodes (no next, no choices, no ending effect)
console.log('\n=== ❸ 死路节点（无next/无choices/无结局效果）===');
const deadEnds = allNodesList.filter(n => !n.next && !n.hasChoices && !n.hasEndingEffect);
if (deadEnds.length === 0) console.log('✓ 无死路节点');
else {
  console.log(`发现 ${deadEnds.length} 个死路节点:`);
  deadEnds.forEach(d => console.log('  🔚', d.id, d.isBattle ? '(战斗后需要确认next)' : ''));
}

// 4. Battle nodes without enemyId
console.log('\n=== ❹ 战斗节点缺少enemyId ===');
const battlesWithoutEnemy = allNodesList.filter(n => n.isBattle && !n.enemyId);
if (battlesWithoutEnemy.length === 0) console.log('✓ 所有战斗节点都有enemyId');
else battlesWithoutEnemy.forEach(b => console.log('  ✗', b.id));

// 5. Chapter transitions
console.log('\n=== ❺ 章节过渡 ===');
const transitions = [];
for (const n of allNodesList) {
  if (n.next) {
    const fromCh = n.id.charAt(2);
    const toCh = n.next.charAt(2);
    if (fromCh !== toCh) transitions.push(`${n.id} (ch${fromCh}) → ${n.next} (ch${toCh})`);
  }
  for (const cn of n.choiceNexts) {
    const fromCh = n.id.charAt(2);
    const toCh = cn.charAt(2);
    if (fromCh !== toCh) transitions.push(`${n.id} (ch${fromCh}) → ${cn} (ch${toCh}) [choice]`);
  }
}
if (transitions.length === 0) console.log('⚠ 未检测到章节过渡！');
else transitions.forEach(t => console.log('→', t));

// 6. Ending effects in ch3
console.log('\n=== ❻ 结局效果节点 ===');
const endingNodes = allNodesList.filter(n => n.hasEndingEffect);
endingNodes.forEach(n => console.log('🏁', n.id));

// 7. Find ch1 ending node (should transition to ch2)
console.log('\n=== ⓫ Ch1最后节点（找Ch1中next=null且非分支/非结局的节点）===');
const ch1Ends = ch1.filter(n => !n.next && !n.hasChoices && !n.hasEndingEffect);
ch1Ends.forEach(n => console.log('  ?', n.id));
const ch1Transitions = transitions.filter(t => t.includes('ch1') && t.includes('ch2'));
if (ch1Transitions.length === 0) {
  // Check if any ch1 node has a nextNode pointing to ch2
  console.log('⚠ 没有ch1→ch2的直接next引用。检查是否通过effect触发章节跳转...');
}
