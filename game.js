

  class User {
    constructor(name) {
      this.name = name;
      this.points = 0;
      this.target = '';
      this.remainingTime = 0;
      this.limb = '';
      this.hasSelected = false; 
      this.selected = false; 
      this.selectedAction = ''; 
    }
  
    setTarget(target) {
      this.target = target;
    }
  
    setLimb(limb) {
      this.limb = limb;
    }
  
    updatePoints(isCorrect) {
      if (isCorrect) {
        this.points += 1;
      } else {
        this.points -= 1;
      }
    }
  
    setRemainingTime(time) {
      this.remainingTime = time;
    }
  
    resetSelection() {
      this.hasSelected = false;
      this.selected = false;
      this.selectedAction = '';
    }
  
    getInfo() {
      return `Points: ${this.points}, Target: ${this.target}, Remaining Time: ${this.remainingTime}, Limb: ${this.limb}`;
    }
  }
  
  class Game {
    constructor(numParticipants, gameDuration) {
      this.users = [];
      this.totalGameTime = gameDuration; 
      this.cycleTime = 10; 
      this.intervalId = null;
      this.createUsers(numParticipants);
      this.updateCycle(); 
    }
  
    createUsers(numParticipants) {
      for (let i = 0; i < numParticipants; i++) {
        const user = new User(`User${i + 1}`);
        this.users.push(user);
      }
    }
  
    startGame() {
      this.startTimer();
      document.getElementById('gameContainer').style.display = 'block';
      this.updateParticipantsDisplay();
    }
  
    startTimer() {
      this.intervalId = setInterval(() => {
        this.totalGameTime -= this.cycleTime;
        if (this.totalGameTime <= 0) {
          clearInterval(this.intervalId);
          this.totalGameTime = 0;
          this.users.forEach(user => user.setRemainingTime(0)); 
          this.declareWinner();
        } else {
          this.updateCycle();
        }
      }, this.cycleTime * 1000);
    }
  
    updateCycle() {
      this.displayAlert();
      this.users.forEach(user => {
        user.setTarget(this.getRandomTarget());
        user.setLimb(this.getRandomLimb());
        user.setRemainingTime(this.totalGameTime);
        user.resetSelection();
      });
      this.selectRandomUserAndAction();
      this.displayCycleInfo();
      this.updateParticipantsDisplay();
    }
  
    getRandomTarget() {
      return Math.random() < 0.5 ? 'A' : 'B';
    }
  
    getRandomLimb() {
      return Math.random() < 0.5 ? 'H' : 'L';
    }
  
    selectRandomUserAndAction() {
      const randomUserIndex = Math.floor(Math.random() * this.users.length);
      const randomUser = this.users[randomUserIndex];
  
      const actions = ['A H', 'A L', 'B H', 'B L'];
      
      
      let randomAction;
      if (Math.random() < 0.6) {
        
        randomAction = `${randomUser.target} ${randomUser.limb}`;
      } else {
        
        randomAction = actions[Math.floor(Math.random() * actions.length)];
      }
  
      setTimeout(() => {
        randomUser.selected = true; 
        randomUser.selectedAction = randomAction; 
        const [target, limb] = randomAction.split(' ');
        randomUser.selectedTarget = target;
        randomUser.selectedLimb = limb;
  
        this.handleUserAction(randomUser.name, target, limb);
  
        this.updateParticipantsDisplay();
      }, 5000); 
    }
  
    displayAlert() {
      const alertBox = document.getElementById('alert');
      alertBox.style.display = 'block';
      setTimeout(() => {
        alertBox.style.display = 'none';
      }, 3000); 
    }
  
    displayCycleInfo() {
      const gameInfo = document.getElementById('gameInfo');
      gameInfo.innerHTML = '';
      this.users.forEach(user => {
        const info = document.createElement('p');
        info.textContent = `${user.name}: Target - ${user.target}, Limb - ${user.limb}`;
        gameInfo.appendChild(info);
      });
    }
  
    updateParticipantsDisplay() {
      const container = document.getElementById('participantsContainer');
      container.innerHTML = '';
      this.users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'participant';
        userDiv.style.backgroundColor = user.selected ? 'lightblue' : 'white';
        userDiv.innerHTML = `
        <h3>${user.name}</h3>
        <p>${user.getInfo()}</p>
        <div class="controls">
          <button onclick="game.handleUserAction('${user.name}', 'A', 'H')" ${user.hasSelected || (!user.selected && this.users.some(u => u.selected)) ? 'disabled' : ''} style="background-color: ${user.selectedAction === 'A H' ? 'yellow' : 'white'};">Target A & Hand</button>
          <button onclick="game.handleUserAction('${user.name}', 'A', 'L')" ${user.hasSelected || (!user.selected && this.users.some(u => u.selected)) ? 'disabled' : ''} style="background-color: ${user.selectedAction === 'A L' ? 'yellow' : 'white'};">Target A & Leg</button>
          <button onclick="game.handleUserAction('${user.name}', 'B', 'H')" ${user.hasSelected || (!user.selected && this.users.some(u => u.selected)) ? 'disabled' : ''} style="background-color: ${user.selectedAction === 'B H' ? 'yellow' : 'white'};">Target B & Hand</button>
          <button onclick="game.handleUserAction('${user.name}', 'B', 'L')" ${user.hasSelected || (!user.selected && this.users.some(u => u.selected)) ? 'disabled' : ''} style="background-color: ${user.selectedAction === 'B L' ? 'yellow' : 'white'};">Target B & Leg</button>
        </div>
      `;
      container.appendChild(userDiv);
    });
  }
  
    handleUserAction(userName, target, limb) {
      const user = this.users.find(u => u.name === userName);
      if (!user || user.hasSelected) return;
      
      const isCorrect = (target === user.target) && (limb === user.limb);
  
      user.updatePoints(isCorrect);
      user.hasSelected = true; 
  
      this.updateParticipantsDisplay();
    }
  
    declareWinner() {
      let maxPoints = Math.max(...this.users.map(user => user.points));
      let winners = this.users.filter(user => user.points === maxPoints);
      const gameInfo = document.getElementById('gameInfo');
      
      if (winners.length > 1) {
        gameInfo.innerHTML = `<h2 style="color: red;">Game ended! It's a draw between: ${winners.map(user => user.name).join(', ')} with ${maxPoints} points each!</h2>`;
      } else {
        gameInfo.innerHTML = `<h2 style="color: red;">Game ended! The winner is ${winners[0].name} with ${maxPoints} points!</h2>`;
      }
      
      setTimeout(() => {
        gameInfo.innerHTML = ''; 
      }, 10000);
    }
  }
  
  document.getElementById('gameSetupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const numParticipants = document.getElementById('numParticipants').value;
    const gameDuration = document.getElementById('gameDuration').value;
    
    window.game = new Game(numParticipants, gameDuration);
    game.startGame();
  });
  
