const BUILTIN_PAPERS = [
  {
    "id": "cet4_2099_01_1",
    "title": "原创示例 · 阅读练习",
    "sections": {
      "c1": {
        "englishTitle": "A Library After Dark",
        "sentences": [
          {
            "id": "s1",
            "paragraph": 1,
            "en": "The library extended its hours so that commuters could borrow books after work.",
            "literal": "图书馆延长了开放时间，以便通勤者能在下班后借书。",
            "grammar": "主句是 The library extended its hours。so that 引导目的状语从句，could 表示这样做让借书成为可能。",
            "chunks": [
              {
                "en": "The library extended its hours",
                "zh": "图书馆延长了开放时间"
              },
              {
                "en": "so that commuters could borrow books after work",
                "zh": "以便通勤者能在下班后借书"
              }
            ],
            "steps": [
              "先确定 its 指图书馆，再结合公共场所的语境，将 hours 理解为开放时间。",
              "后半句说明延时的目的，用「以便」保留主从关系。"
            ],
            "phrases": [
              {
                "text": "its hours",
                "meaning": "图书馆的开放时间",
                "explanation": "its 回指主句主语 the library。"
              }
            ]
          },
          {
            "id": "s2",
            "paragraph": 1,
            "en": "On the first evening, volunteers helped visitors find the books they needed.",
            "literal": "在第一个晚上，志愿者帮来访者找到他们需要的书。",
            "grammar": "they needed 是省略关系代词的定语从句，修饰 books。they 指 visitors。"
          }
        ],
        "questions": [
          {
            "id": "46",
            "prompt": "Why did the library extend its hours?",
            "options": [
              [
                "A",
                "To hire more staff.",
                "为雇更多员工。"
              ],
              [
                "B",
                "To help commuters borrow books.",
                "为方便通勤者借书。"
              ],
              [
                "C",
                "To save money.",
                "为省钱。"
              ],
              [
                "D",
                "To deliver books.",
                "为送书。"
              ]
            ],
            "answer": "B",
            "evidence": [
              "s1"
            ],
            "explanation": "so that 后面直接给出了延长开放时间的目的。",
            "zh": "图书馆为什么延长开放时间？"
          },
          {
            "id": "47",
            "prompt": "Who helped the visitors?",
            "options": [
              [
                "A",
                "Teachers.",
                "老师。"
              ],
              [
                "B",
                "Commuters.",
                "通勤者。"
              ],
              [
                "C",
                "Volunteers.",
                "志愿者。"
              ],
              [
                "D",
                "Writers.",
                "作家。"
              ]
            ],
            "answer": "C",
            "evidence": [
              "s2"
            ],
            "zh": "谁帮助了来访者？"
          },
          {
            "id": "48",
            "prompt": "When did the volunteers help?",
            "options": [
              [
                "A",
                "On the first evening.",
                "第一天晚上。"
              ],
              [
                "B",
                "On the second morning.",
                "第二天早上。"
              ],
              [
                "C",
                "At noon.",
                "中午。"
              ],
              [
                "D",
                "Before the opening.",
                "开门之前。"
              ]
            ],
            "answer": "A",
            "evidence": [
              "s2"
            ],
            "zh": "志愿者什么时候提供帮助？"
          },
          {
            "id": "49",
            "prompt": "What were the visitors looking for?",
            "options": [
              [
                "A",
                "Jobs.",
                "工作。"
              ],
              [
                "B",
                "Keys.",
                "钥匙。"
              ],
              [
                "C",
                "Tickets.",
                "票。"
              ],
              [
                "D",
                "Books.",
                "书。"
              ]
            ],
            "answer": "D",
            "evidence": [
              "s2"
            ],
            "zh": "来访者在找什么？"
          },
          {
            "id": "50",
            "prompt": "What does “its” in the first sentence refer to?",
            "options": [
              [
                "A",
                "The visitors.",
                "来访者。"
              ],
              [
                "B",
                "The library.",
                "图书馆。"
              ],
              [
                "C",
                "The books.",
                "书。"
              ],
              [
                "D",
                "The volunteers.",
                "志愿者。"
              ]
            ],
            "answer": "B",
            "evidence": [
              "s1"
            ],
            "zh": "第一句中的 its 指什么？"
          }
        ],
        "glossary": [
          {
            "head": "commuter",
            "forms": [
              "commuters"
            ],
            "senses": [
              [
                "名词",
                "通勤者",
                "a person who regularly travels between home and work",
                "Many commuters take the early train."
              ]
            ]
          },
          {
            "head": "extend",
            "forms": [
              "extended"
            ],
            "senses": [
              [
                "动词",
                "延长，延伸",
                "to make something longer in time or space",
                "The team extended the deadline by a week."
              ],
              [
                "动词",
                "提供，给予",
                "to offer something formally",
                "She extended an invitation to the new neighbors."
              ]
            ]
          }
        ],
        "sourceNote": "原创练习，用于演示查词、选句、贴胶带与答题。"
      }
    },
    "related": []
  }
];
