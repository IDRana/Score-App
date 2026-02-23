// Game state
let gameState = {
    team1: { name: '', runs: 0, wickets: 0, overs: 0, balls: 0 },
    team2: { name: '', runs: 0, wickets: 0, overs: 0, balls: 0 },
    totalOvers: 20,
    currentInnings: 1,
    battingTeam: null,
    currentOver: [],
    history: [],
    matchEnded: false
};

function startMatch() {
    const team1Name = document.getElementById('team1Name').value.trim() || 'Team A';
    const team2Name = document.getElementById('team2Name').value.trim() || 'Team B';
    const totalOvers = parseInt(document.getElementById('totalOvers').value) || 20;

    gameState.team1.name = team1Name;
    gameState.team2.name = team2Name;
    gameState.totalOvers = totalOvers;
    gameState.battingTeam = gameState.team1;

    document.getElementById('matchSetup').style.display = 'none';
    document.getElementById('scoringArea').style.display = 'block';
    
    updateDisplay();
}

function addRuns(runs) {
    if (gameState.matchEnded) return;

    const team = gameState.battingTeam;
    team.runs += runs;

    // Add ball to over (legal delivery)
    team.balls++;
    gameState.currentOver.push({ type: 'run', value: runs });
    
    // Save to history
    gameState.history.push({
        action: 'run',
        runs: runs,
        team: team === gameState.team1 ? 1 : 2
    });

    checkOverComplete();
    checkInningsEnd();
    updateDisplay();
}

function addExtra(type) {
    if (gameState.matchEnded) return;

    const team = gameState.battingTeam;
    let runs = 1;

    // Wide and No Ball add a run and don't count as a legal delivery
    if (type === 'wide' || type === 'noBall') {
        team.runs += runs;
        gameState.currentOver.push({ type: 'extra', value: type });
    } 
    // Bye and Leg Bye add a run and count as a legal delivery
    else if (type === 'bye' || type === 'legBye') {
        team.runs += runs;
        team.balls++;
        gameState.currentOver.push({ type: 'extra', value: type });
        checkOverComplete();
    }

    gameState.history.push({
        action: 'extra',
        extraType: type,
        team: team === gameState.team1 ? 1 : 2
    });

    checkInningsEnd();
    updateDisplay();
}

function addWicket() {
    if (gameState.matchEnded) return;

    const team = gameState.battingTeam;
    team.wickets++;
    team.balls++;

    gameState.currentOver.push({ type: 'wicket', value: 'W' });
    gameState.history.push({
        action: 'wicket',
        team: team === gameState.team1 ? 1 : 2
    });

    checkOverComplete();
    checkInningsEnd();
    updateDisplay();
}

function checkOverComplete() {
    const team = gameState.battingTeam;
    
    if (team.balls >= 6) {
        team.overs++;
        team.balls = 0;
        gameState.currentOver = [];
    }
}

function checkInningsEnd() {
    const team = gameState.battingTeam;
    
    // Check if all wickets are down
    if (team.wickets >= 10) {
        setTimeout(() => endInnings(), 500);
        return;
    }

    // Check if overs are complete
    if (team.overs >= gameState.totalOvers) {
        setTimeout(() => endInnings(), 500);
        return;
    }

    // Check if target is achieved (2nd innings)
    if (gameState.currentInnings === 2) {
        const target = gameState.team1.runs + 1;
        if (team.runs >= target) {
            setTimeout(() => endMatch(), 500);
            return;
        }
    }
}

function endInnings() {
    if (gameState.matchEnded) return;

    if (gameState.currentInnings === 1) {
        // Switch to second innings
        gameState.currentInnings = 2;
        gameState.battingTeam = gameState.team2;
        gameState.currentOver = [];
        updateDisplay();
    } else {
        // Match ends
        endMatch();
    }
}

function endMatch() {
    gameState.matchEnded = true;
    
    const team1Score = gameState.team1.runs;
    const team2Score = gameState.team2.runs;
    
    let resultText = '';
    
    if (team1Score > team2Score) {
        const margin = team1Score - team2Score;
        resultText = `${gameState.team1.name} won by ${margin} runs!`;
    } else if (team2Score > team1Score) {
        const margin = 10 - gameState.team2.wickets;
        resultText = `${gameState.team2.name} won by ${margin} wickets!`;
    } else {
        resultText = 'Match Tied!';
    }

    const summaryHTML = `
        <div class="winner">${resultText}</div>
        <p><strong>${gameState.team1.name}:</strong> ${team1Score}/${gameState.team1.wickets} (${gameState.team1.overs}.${gameState.team1.balls} overs)</p>
        <p><strong>${gameState.team2.name}:</strong> ${team2Score}/${gameState.team2.wickets} (${gameState.team2.overs}.${gameState.team2.balls} overs)</p>
    `;

    document.getElementById('summaryContent').innerHTML = summaryHTML;
    document.getElementById('matchSummary').style.display = 'block';
    
    // Hide controls
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('.ball-history').style.display = 'none';
}

function undoLast() {
    if (gameState.history.length === 0 || gameState.matchEnded) return;

    const lastAction = gameState.history.pop();
    const team = lastAction.team === 1 ? gameState.team1 : gameState.team2;

    if (lastAction.action === 'run') {
        team.runs -= lastAction.runs;
        team.balls--;
        if (team.balls < 0) {
            team.overs--;
            team.balls = 5;
        }
        gameState.currentOver.pop();
    } else if (lastAction.action === 'wicket') {
        team.wickets--;
        team.balls--;
        if (team.balls < 0) {
            team.overs--;
            team.balls = 5;
        }
        gameState.currentOver.pop();
    } else if (lastAction.action === 'extra') {
        team.runs -= 1;
        if (lastAction.extraType === 'bye' || lastAction.extraType === 'legBye') {
            team.balls--;
            if (team.balls < 0) {
                team.overs--;
                team.balls = 5;
            }
        }
        gameState.currentOver.pop();
    }

    updateDisplay();
}

function resetMatch() {
    gameState = {
        team1: { name: '', runs: 0, wickets: 0, overs: 0, balls: 0 },
        team2: { name: '', runs: 0, wickets: 0, overs: 0, balls: 0 },
        totalOvers: 20,
        currentInnings: 1,
        battingTeam: null,
        currentOver: [],
        history: [],
        matchEnded: false
    };

    document.getElementById('matchSetup').style.display = 'block';
    document.getElementById('scoringArea').style.display = 'none';
    document.getElementById('matchSummary').style.display = 'none';
    document.querySelector('.controls').style.display = 'block';
    document.querySelector('.ball-history').style.display = 'block';
}

function updateDisplay() {
    const team = gameState.battingTeam;
    
    // Update team name
    document.getElementById('battingTeamName').textContent = team.name;
    
    // Update score
    document.getElementById('runs').textContent = team.runs;
    document.getElementById('wickets').textContent = team.wickets;
    document.getElementById('overs').textContent = `${team.overs}.${team.balls}`;
    
    // Calculate and update run rate
    const totalBalls = (team.overs * 6) + team.balls;
    const runRate = totalBalls > 0 ? ((team.runs / totalBalls) * 6).toFixed(2) : '0.00';
    document.getElementById('runRate').textContent = runRate;
    
    // Update innings info
    const inningsText = gameState.currentInnings === 1 ? '1st Innings' : '2nd Innings';
    document.getElementById('inningsInfo').textContent = inningsText;
    
    // Show target in 2nd innings
    if (gameState.currentInnings === 2) {
        const target = gameState.team1.runs + 1;
        const requiredRuns = target - team.runs;
        const remainingBalls = (gameState.totalOvers * 6) - ((team.overs * 6) + team.balls);
        const requiredRunRate = remainingBalls > 0 ? ((requiredRuns / remainingBalls) * 6).toFixed(2) : '0.00';
        
        document.getElementById('targetDisplay').style.display = 'block';
        document.getElementById('targetScore').textContent = target;
        document.getElementById('requiredRunRate').textContent = requiredRunRate;
    } else {
        document.getElementById('targetDisplay').style.display = 'none';
    }
    
    // Update current over display
    updateCurrentOver();
    
    // Update button states
    document.getElementById('undoBtn').disabled = gameState.history.length === 0;
}

function updateCurrentOver() {
    const overDisplay = document.getElementById('currentOver');
    overDisplay.innerHTML = '';
    
    gameState.currentOver.forEach(ball => {
        const ballElement = document.createElement('div');
        ballElement.className = 'ball';
        
        if (ball.type === 'run') {
            if (ball.value === 0) {
                ballElement.classList.add('ball-dot');
                ballElement.textContent = '•';
            } else if (ball.value === 4) {
                ballElement.classList.add('ball-boundary');
                ballElement.textContent = '4';
            } else if (ball.value === 6) {
                ballElement.classList.add('ball-six');
                ballElement.textContent = '6';
            } else {
                ballElement.classList.add('ball-run');
                ballElement.textContent = ball.value;
            }
        } else if (ball.type === 'wicket') {
            ballElement.classList.add('ball-wicket');
            ballElement.textContent = 'W';
        } else if (ball.type === 'extra') {
            ballElement.classList.add('ball-extra');
            const extraLabels = {
                'wide': 'Wd',
                'noBall': 'Nb',
                'bye': 'B',
                'legBye': 'Lb'
            };
            ballElement.textContent = extraLabels[ball.value] || 'E';
        }
        
        overDisplay.appendChild(ballElement);
    });
}
