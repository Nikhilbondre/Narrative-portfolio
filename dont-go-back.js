(() => {
  const demo = document.querySelector('#demo');
  if (!demo) return;
  const textEl = document.querySelector('#demo-text');
  const dialogueEl = document.querySelector('#demo-dialogue');
  const timeEl = document.querySelector('#demo-time');
  const stageEl = document.querySelector('#demo-stage');
  const choicesEl = document.querySelector('#demo-choices');
  const playBtn = document.querySelector('#play-demo');
  const restartBtn = document.querySelector('#restart-demo');
  const statusEl = document.querySelector('#demo-status');
  const endingEl = document.querySelector('#demo-ending');
  const againBtn = document.querySelector('#play-again');
  let firstChoice = null;
  let runCount = 0;

  const firstChoiceLines = {
    A: '“You always ask questions first.”',
    B: '“Aman’s asleep. You always make jokes when you’re scared.”',
    C: '“Deleting it never works. You always pretend not to know.”'
  };
  const laterChoiceLines = {
    A: '“You always think knowing someone’s name means understanding them.”',
    B: '“Forty-one times. Poor Aman.”',
    C: '“You still think ignoring something makes it disappear.”'
  };

  function setScene({ time = '', stage = '', text = '', dialogue = '', choices = [], status = '' }) {
    timeEl.textContent = time;
    stageEl.textContent = stage;
    textEl.replaceChildren();
    String(text).split('\n\n').filter(Boolean).forEach((para) => {
      const p = document.createElement('p');
      p.textContent = para;
      textEl.appendChild(p);
    });
    dialogueEl.textContent = dialogue;
    dialogueEl.hidden = !dialogue;
    choicesEl.replaceChildren();
    choicesEl.hidden = choices.length === 0;
    choices.forEach((choice) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice-btn';
      const letter = document.createElement('span');
      letter.className = 'choice-letter';
      letter.textContent = choice.key;
      const content = document.createElement('span');
      content.textContent = choice.label;
      button.append(letter, content);
      button.addEventListener('click', choice.onChoose);
      choicesEl.appendChild(button);
    });
    statusEl.textContent = status;
  }

  function begin() {
    firstChoice = null;
    runCount += 1;
    playBtn.hidden = true;
    restartBtn.hidden = false;
    endingEl.hidden = true;
    setScene({
      time: '11:41 P.M. · RAIN', stage: 'CHOICE 01 / REPLY',
      text: 'Your phone buzzes. The message comes from your own number.\n\nYou check the contact name. It says Me.',
      dialogue: 'DON’T GO BACK FOR THE UMBRELLA. TAKE THE 11:50 BUS.',
      choices: [
        { key: 'A', label: 'Reply: “Who is this?”', onChoose: () => makeFirstChoice('A') },
        { key: 'B', label: 'Reply: “lol nice try, Aman.”', onChoose: () => makeFirstChoice('B') },
        { key: 'C', label: 'Delete the message.', onChoose: () => makeFirstChoice('C') }
      ],
      status: 'CHOICE MEMORY: EMPTY · YOUR FIRST RESPONSE WILL RETURN LATER'
    });
  }

  function makeFirstChoice(key) {
    firstChoice = key;
    setScene({
      time: '11:41 P.M. · TEN SECONDS', stage: 'PREDICTION CONFIRMED',
      text: `${firstChoiceLines[key]}\n\nAnother message arrives: “IN TEN SECONDS, A BROWN DOG WILL RUN PAST. DON’T FOLLOW IT.”\n\nYou count. At ten, a brown dog sprints through the rain, its leash dragging behind it. Your hands begin to shake.\n\nThe next message says Bus 612 is coming, and warns you not to look at the fourth-floor window. You look anyway. Someone in your orange jacket stands beside your desk, holding up your umbrella and waving. Not for help. Goodbye.`,
      dialogue: 'THE BUS ARRIVES. THE DOORS OPEN. 11:49 P.M.',
      choices: [
        { key: 'A', label: 'Get on the bus.', onChoose: takeBus },
        { key: 'B', label: 'Go upstairs. You need to know who’s wearing your jacket.', onChoose: goUpstairs }
      ],
      status: `CHOICE MEMORY SAVED: ${key} · NEXT: BUS OR FOURTH FLOOR`
    });
  }

  function takeBus() {
    const callback = laterChoiceLines[firstChoice] || '';
    setScene({
      time: '11:50 P.M. · BUS 612', stage: 'ROUTE A / THE BUS',
      text: `You board. As the doors close, the fourth-floor light goes out. Your phone buzzes: “FORTY-ONE TRIES. YOU’RE THE FIRST ONE WHO LISTENED.” The contact name changes to Neel (Upstairs).\n\nTwo stops later, a soaked man in an orange jacket climbs aboard, carrying your umbrella. He sits beside you.\n\n“Hi,” he says. “I took the stairs.”\n\n“You’re me?”\n\n“Unfortunately.”\n\nHe explains that every Neel who goes upstairs ends up sending the warning to the next one. Forty-one versions have tried. Most couldn’t resist finding out who was waiting in the office.\n\n“Why keep warning me?” you ask.\n\n“Because someone has to.”\n\nYour first choice comes back to you: ${callback}\n\nHe looks out at the rain. “You spent the whole night afraid of me,” he says. “I was waving goodbye.” The bus stops. He leaves the umbrella beside you.`,
      dialogue: 'YOU DON’T HAVE TO SAVE ME. JUST DON’T BECOME ME.',
      choices: [{ key: '→', label: 'Continue to the ending.', onChoose: () => finish('BUS') }],
      status: 'ROUTE A · YOU LISTENED. THE WARNING WAS A REQUEST.'
    });
  }

  function goUpstairs() {
    const rememberedReply = firstChoice === 'A' ? '“Who is this?”' : firstChoice === 'B' ? '“lol nice try, Aman.”' : '(A blank space.)';
    setScene({
      time: '11:49 P.M. · FOURTH FLOOR', stage: 'ROUTE B / UPSTAIRS',
      text: `You run to the fourth floor. The office is empty. Your orange jacket hangs over your chair. Your umbrella rests on the desk, perfectly dry.\n\nYour phone buzzes: “DON’T GO BACK FOR THE UMBRELLA. TAKE THE 11:50 BUS.”\n\nYou scroll through your messages. Forty-one identical conversations. In each, your reply is the same: ${rememberedReply}`,
      dialogue: '',
      choices: [
        { key: 'A', label: 'Send the same warning to the Neel at the bus stop.', onChoose: sendWarning },
        { key: 'B', label: 'Message: “Come upstairs. I need help.”', onChoose: inviteAman }
      ],
      status: 'ROUTE B · YOU HAVE REACHED THE PLACE THE WARNING CAME FROM'
    });
  }

  function sendWarning() {
    setScene({
      time: '11:50 P.M. · THE WINDOW', stage: 'ROUTE B / LOOP CONTINUES',
      text: 'You look through the window. Below, another Neel stands at the bus stop, staring at his phone. You’re wearing the orange jacket now. Your hand holds the umbrella. You’re waving.\n\nYou send the warning. He reads it. A reply arrives.',
      dialogue: 'WHO IS THIS?\n\nFORTY-TWO.',
      choices: [{ key: '→', label: 'See the ending.', onChoose: () => finish('WARNING') }],
      status: 'THE COUNT HAS CHANGED · ANOTHER VERSION IS NOW IN THE LOOP'
    });
  }

  function inviteAman() {
    setScene({
      time: '11:50 P.M. · TOMORROW', stage: 'ROUTE B / THE INVITATION',
      text: 'You invite him upstairs. He crosses the road. The lift begins to rise. You look at the umbrella in your hand, then notice the photograph beside your keyboard. It shows you outside the building in the rain, wearing the same orange jacket and holding the same umbrella. Behind you, the office windows are dark. Someone has written a date on the back: Tomorrow. Your face looks tired. Older, somehow.\n\nA bus horn sounds below. Through its rear window, someone in an orange jacket stares up at you. He raises his hand. You raise yours without thinking. The bus turns the corner, and he’s gone.\n\nYou check your phone. 11:50 p.m. For the first time, you wonder whether the forty-one Neels before you were trying to escape the loop—or trying to warn you about what happens when you do.\n\nYou pick up the umbrella. The lift opens behind you. Someone steps out.\n\n“Neel?” a voice calls. “You left this downstairs.”\n\nIt’s Aman, holding your office ID. He looks at the umbrella in your hand, then at the window.',
      dialogue: '“Who were you waving at?”',
      choices: [{ key: '→', label: 'Finish the story.', onChoose: () => finish('INVITATION') }],
      status: 'THE LOOP IS STILL UNEXPLAINED · AMAN HAS ARRIVED'
    });
  }

  function finish(route) {
    stageEl.textContent = 'END OF DEMO';
    choicesEl.replaceChildren();
    choicesEl.hidden = true;
    endingEl.hidden = false;
    const quote = endingEl.querySelector('blockquote');
    const endingLine = route === 'BUS'
      ? '“You don’t have to save me. Just don’t become me.”'
      : route === 'WARNING'
        ? '“Every warning is another chance to choose.”'
        : '“The loop repeats. The choice is yours.”';
    quote.textContent = endingLine;
    statusEl.textContent = `RUN ${runCount} COMPLETE · ROUTE: ${route} · THANKS FOR PLAYING`;
    timeEl.textContent = '11:50 P.M. · END';
  }

  playBtn.addEventListener('click', begin);
  restartBtn.addEventListener('click', begin);
  againBtn?.addEventListener('click', begin);
})();
