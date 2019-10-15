(() => {
  const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
  
  const gameState = {
    quizzes: [],
    quizIndex: 0,
    correctCount: 0
  };
  
  const questionText = document.getElementById('question');
  const answerContainer = document.getElementById('answer-container');
  const resultText = document.getElementById('result');
  const resetBtn = document.getElementById('reset-btn');
  
  window.addEventListener('load', () => {
    fetchQuiz();
  });
  
  resetBtn.addEventListener('click', (event) => {
    gameState.quizIndex = 0;
    gameState.correctCount = 0;
    fetchQuiz();
  });
  
  const fetchQuiz = async () => {
    questionText.textContent = 'Now Loading...';
    allAnswerDel();
    resultText.textContent = '';
    resetBtn.hidden = true;
    
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      gameState.quizzes = data.results;
      nextQuiz();
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const allAnswerDel = () => {
    while(answerContainer.firstChild) {
      answerContainer.removeChild(answerContainer.firstChild);
    };
  };
  
  const nextQuiz = () => {
    questionText.textContent = 'Now Loading...';
    allAnswerDel();
    if(gameState.quizIndex < gameState.quizzes.length) {
      setQuiz(gameState.quizzes[gameState.quizIndex]);
    } else {
      finishQuiz();
    }
  };
  
  const setQuiz = (quiz) => {
    questionText.textContent = unescapeHTML(quiz.question);
    const answers = answerChainShuffle(quiz);
    answers.forEach(answer => {
      const liElement = document.createElement('li');
      liElement.textContent = unescapeHTML(answer);
      answerContainer.appendChild(liElement);

      liElement.addEventListener('click', event => {
        gameState.quizIndex++;
        
        const correctAnswer = unescapeHTML(quiz.correct_answer);
        if(event.target.textContent === correctAnswer) {
          gameState.correctCount++;
          alert('Correct!!!');
        } else {
          alert(`Wrong... Answer is [${correctAnswer}]`);
        }
        nextQuiz();
      });
    });
  };
  
  const finishQuiz = () => {
    questionText.textContent = '--Result--';
    resultText.textContent = `${gameState.correctCount}/${gameState.quizzes.length} was correct.`;
    resetBtn.hidden = false;
  };
  
  const answerChainShuffle = (quiz) => {
    const answers = quiz.incorrect_answers;
    answers.push(quiz.correct_answer);
    return shuffle(answers);
  };
  
  const shuffle = (array) => {
    const cpArray = array.slice();
    for (let i = cpArray.length - 1; i >= 0; i--) {
      // 0~iのランダムな数値を取得
      const rand = Math.floor(Math.random() * (i + 1));

      // 配列の数値を入れ替える
      [cpArray[i], cpArray[rand]] = [cpArray[rand], cpArray[i]]
    }
    return cpArray;
  };
  
  const unescapeHTML = (str) => {
    const div = document.createElement("div");
    div.innerHTML = str.replace(/</g,"&lt;")
                       .replace(/>/g,"&gt;")
                       .replace(/ /g, "&nbsp;")
                       .replace(/\r/g, "&#13;")
                       .replace(/\n/g, "&#10;");

    return div.textContent || div.innerText;
  };
})();