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
                "To hire more staff."
              ],
              [
                "B",
                "To help commuters borrow books."
              ],
              [
                "C",
                "To save money."
              ],
              [
                "D",
                "To deliver books."
              ]
            ],
            "answer": "B",
            "evidence": [
              "s1"
            ],
            "explanation": "so that 后面直接给出了延长开放时间的目的。"
          },
          {
            "id": "47",
            "prompt": "Who helped the visitors?",
            "options": [
              [
                "A",
                "Teachers."
              ],
              [
                "B",
                "Commuters."
              ],
              [
                "C",
                "Volunteers."
              ],
              [
                "D",
                "Writers."
              ]
            ],
            "answer": "C",
            "evidence": [
              "s2"
            ]
          },
          {
            "id": "48",
            "prompt": "When did the volunteers help?",
            "options": [
              [
                "A",
                "On the first evening."
              ],
              [
                "B",
                "On the second morning."
              ],
              [
                "C",
                "At noon."
              ],
              [
                "D",
                "Before the opening."
              ]
            ],
            "answer": "A",
            "evidence": [
              "s2"
            ]
          },
          {
            "id": "49",
            "prompt": "What were the visitors looking for?",
            "options": [
              [
                "A",
                "Jobs."
              ],
              [
                "B",
                "Keys."
              ],
              [
                "C",
                "Tickets."
              ],
              [
                "D",
                "Books."
              ]
            ],
            "answer": "D",
            "evidence": [
              "s2"
            ]
          },
          {
            "id": "50",
            "prompt": "What does “its” in the first sentence refer to?",
            "options": [
              [
                "A",
                "The visitors."
              ],
              [
                "B",
                "The library."
              ],
              [
                "C",
                "The books."
              ],
              [
                "D",
                "The volunteers."
              ]
            ],
            "answer": "B",
            "evidence": [
              "s1"
            ]
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
