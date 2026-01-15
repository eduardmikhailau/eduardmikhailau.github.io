# Topic: “Mano šeima” — test templates

## 1. Word set (topic vocabulary)

```json
{
  "topic": "Mano šeima",
  "words": [
    { "id": "tevas",   "lt": "tėvas",   "ru": "отец",      "gender": "m" },
    { "id": "mama",    "lt": "mama",    "ru": "мама",      "gender": "f" },
    { "id": "sunus",   "lt": "sūnus",   "ru": "сын",       "gender": "m" },
    { "id": "dukra",   "lt": "dukra",   "ru": "дочь",      "gender": "f" },
    { "id": "brolis",  "lt": "brolis",  "ru": "брат",      "gender": "m" },
    { "id": "sesuo",   "lt": "sesuo",   "ru": "сестра",    "gender": "f" },
    { "id": "senelis", "lt": "senelis", "ru": "дедушка",   "gender": "m" },
    { "id": "senele",  "lt": "senelė",  "ru": "бабушка",   "gender": "f" },
    { "id": "vyras",   "lt": "vyras",   "ru": "муж",       "gender": "m" },
    { "id": "zmona",   "lt": "žmona",   "ru": "жена",      "gender": "f" }
  ]
}
```

---

## 2. Common instructions for all tests

- Test variants should be randomized each time
- If an answer is incorrect, show the correct option
- It should be clear whether the answer is correct
- At the end of the tests, show full progress analytics
- For each word, create at least 3 tests of each type
- For each word, include 2 flashcards

---

## 3. Test type 1 — Flashcards

**Idea:**  
Show a word in one language → the user recalls the translation.  
You can add modes: `ltToRu` and `ruToLt`.

### Structure

```json
{
  "testType": "flashcards",
  "modes": ["ltToRu", "ruToLt"],
  "settings": {
    "randomOrder": true,
    "showHint": true
  }
}
```

### Behavior

- Show a word (`lt` or `ru`)
- Button **Show answer**
- Buttons **Know / Don’t know**
- You can track stats

---

## 4. Test type 2 — Multiple Choice

**Idea:**  
Show a word → choose the correct translation from 3 options.

### Example

```json
{
  "testType": "multipleChoice",
  "questions": [
    {
      "id": "mc_1",
      "question": "sūnus",
      "questionLang": "lt",
      "optionsLang": "ru",
      "options": [
        { "text": "брат",   "correct": false },
        { "text": "сын",    "correct": true  },
        { "text": "муж",    "correct": false }
      ]
    }
  ]
}
```

---

## 5. Test type 3 — Gap Fill

**Idea:**  
Insert the word from context.

### Example

```json
{
  "testType": "gapFill",
  "questions": [
    {
      "id": "gf_1",
      "sentence": "Mano ___ dirba ligoninėje.",
      "translationRu": "Моя ___ работает в больнице.",
      "options": ["mama", "brolis", "senelis"],
      "correct": "mama"
    }
  ]
}
```

---

## 6. Test type 4 — Gap Fill (Typing)

**Idea:**  
Show a sentence with a gap; the learner types the missing word.

### Example

```json
{
  "testType": "gapFillInput",
  "questions": [
    {
      "id": "gfi_1",
      "sentence": "Aš einu į ___.",
      "translationRu": "Я иду в ___ .",
      "correct": "parduotuvę"
    }
  ]
}
```

---

## 7. Overall set structure

```json
{
  "topic": "Mano šeima",
  "words": [/* ... */],
  "tests": [
    { "testType": "flashcards" },
    { "testType": "multipleChoice" },
    { "testType": "gapFill" },
    { "testType": "gapFillInput" }
  ]
}
```
