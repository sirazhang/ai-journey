# Phase 2 NPC 位置和大小

## Island 1 - Homogenization Detection (6个NPC)

| NPC ID | 大小 | 位置 | 正确答案 | 进度位置 |
|--------|------|------|----------|----------|
| npc1_p2 | 200px | left: 5%, top: 5% | passed | - |
| npc5_p2 | 150px | left: 20%, bottom: 20% | **failed** | 1 |
| npc6_p2 | 180px | left: 35%, bottom: 15% | passed | - |
| npc7_p2 | 180px | right: 40%, bottom: 30% | passed | - |
| npc10_p2 | 200px | right: 10%, top: 10% | **failed** | 2 |
| npc11_p2 | 250px | right: 15%, bottom: 15% | passed | - |

**Failed NPCs (需要识别)**: npc5_p2, npc10_p2

---

## Island 2 - Text Evaluation (3个NPC)

| NPC ID | 大小 | 位置 | 正确答案 | 进度位置 |
|--------|------|------|----------|----------|
| npc2_p2 | 250px | left: 5%, top: 10% | passed | - |
| npc20_p2 | 260px | left: 10%, bottom: 15% | **failed** | 3 |
| npc21_p2 | 150px | right: 20%, bottom: 10% | passed | - |

**Failed NPCs (需要识别)**: npc20_p2

---

## Island 3 - Poetry Evaluation (5个NPC)

| NPC ID | 大小 | 位置 | 正确答案 | 进度位置 |
|--------|------|------|----------|----------|
| npc3_p2 | 250px | left: 5%, top: 10% | passed | - |
| npc12_p2 | 150px | left: 10%, bottom: 45% | **failed** | 4 |
| npc15_p2 | 200px | left: 10%, bottom: 10% | passed | - |
| npc16_p2 | 150px | right: 35%, bottom: 10% | **failed** | 5 |
| npc18_p2 | (继续...) | | | |

**Failed NPCs (需要识别)**: npc12_p2, npc16_p2

---

## 进度条显示逻辑

Phase 2 总共有 **5个椰子**，对应5个需要识别的GenAI NPC：

1. 椰子1 → Island 1 - npc5_p2
2. 椰子2 → Island 1 - npc10_p2
3. 椰子3 → Island 2 - npc20_p2
4. 椰子4 → Island 3 - npc12_p2
5. 椰子5 → Island 3 - npc16_p2

## 修复内容

已修复 `handleConversationJudgment` 中的进度跟踪逻辑：
- 不再检查 `judgment === 'failed'`（这个值是'worker'或'genai'）
- 改为检查 `currentMissionNpc.correctAnswer === 'failed'`
- 正确映射所有5个Phase 2 failed NPCs到进度位置
