const init = () => {
    let score = 0;
    document.getElementById('score').textContent = score;
    
    populateSeasonDropDown();
    document.getElementById('main-game-form').addEventListener('submit', handleForm);
    document.getElementById('clear-score-button').addEventListener('click', e => {
        score = 0;
        document.getElementById('score').textContent = score;
    })

    function populateSeasonDropDown() {
        fetch('https://statsapi.web.nhl.com/api/v1/seasons')
        .then(res => res.json())
        .then(data => {
            data.seasons.forEach(element => {
                if(element.seasonEndDate.replaceAll('-','') < getCurrentDate()) createDropDownElement(element.seasonId, 'season');
            })
        })
    }

    function createDropDownElement (element, category) {
        const dropdown = document.getElementById(`${category}-dropdown`); 
        const option = document.createElement('option');
        option.value = element;
        option.textContent = `${element.slice(0,4)}-${element.slice(4)}`;
        dropdown.appendChild(option);
        dropdown.insertBefore(option, dropdown.children[1]);
    }

    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = date.getMonth().toString().length === 1 ? `0${date.getMonth().toString()}` : date.getMonth().toString();
        const day = date.getDate().toString().length === 1 ? `0${date.getDate().toString()}` : date.getDate().toString();
        return `${year}${month}${day}`;
    }




    function handleForm(e){
        e.preventDefault();
        const submitButton = document.getElementById('submit-button');
        submitButton.disabled = true;
        setTimeout(() => submitButton.disabled = false, 300);
        if(document.getElementById('card-container')) document.getElementById('card-container').remove();
        const dropDownSelection = document.getElementById('season-dropdown').value;
        if(dropDownSelection === '') {
            submitButton.disabled = false;
            return alert('Oops! You need to choose a valid season.');
        }
        chooseTeamsOnSubmit(dropDownSelection);
    }

    function chooseTeamsOnSubmit(chosenSeason){
        fetch(`https://statsapi.web.nhl.com/api/v1/standings?season=${chosenSeason}`)
        .then(res => res.json())
        .then(data => {
            createTeamEvaluation(data);
        })
    }

    function createTeamEvaluation(data){
        const selectionContainer = document.getElementById('selection-container');
        const cardContainer = document.createElement('div');
        cardContainer.id = 'card-container';
        cardContainer.className = 'container';

        const selectionTable = createTable();

        const statList = ['goalsScored', 'goalsAgainst', 'points', 'wins', 'losses'];
        const chosenTeamData = [];
        const chosenStat = chooseRandomValue(statList);
        const chosenTeams = findTeamPairing(data);
        chosenTeams.forEach(element => chosenTeamData.push(retrieveTeamData(data, element, chosenStat)));

        setTimeout(() => {
            document.getElementById('cell-21').textContent = chosenTeamData[0].team;
            document.getElementById('cell-22').textContent = formatStat(chosenTeamData[0].stat);
            document.getElementById('cell-23').textContent = chosenTeamData[1].team;
        }, 100)
        
        cardContainer.appendChild(selectionTable);
        selectionContainer.appendChild(cardContainer);

        document.getElementById('button-left').addEventListener('click', e => handleTeamButton(e, chosenTeamData));
        document.getElementById('button-right').addEventListener('click', e => handleTeamButton(e, chosenTeamData));
    }

    function findTeamPairing(seasonData){
        const teams = [];
        const chosenTeams = [];

        seasonData.records.forEach(element => element.teamRecords.forEach(innerElement => teams.push(innerElement.team.id)));

        chosenTeams.push(chooseRandomValue(teams));

        while(chosenTeams.length < 2){
            const newTeam = chooseRandomValue(teams);
            if(! chosenTeams.includes(newTeam)) chosenTeams.push(newTeam);
        }
        return chosenTeams;
    }

    function retrieveTeamData(seasonData, teamId, stat){
        const teamObj = {};
        seasonData.records.forEach(element => element.teamRecords.forEach(innerElement => {
            if(innerElement.team.id === teamId){
                teamObj.team = innerElement.team.name;
                teamObj.stat = stat;

                if(stat === 'wins' || stat === 'losses'){
                    teamObj.statVal = innerElement.leagueRecord[stat];
                } else {
                    teamObj.statVal = innerElement[stat];
                }
            }
        }))
        return teamObj;
    }

    function handleTeamButton(e, teamData){
        const cardContainer = document.getElementById('card-container');
        const scoreCounter = document.getElementById('score');
        const isLeftButton = e.target.id === 'button-left';
        const stat = teamData[0].stat;
        const leftStat = teamData[0].statVal;
        const rightStat = teamData[1].statVal;
        const positiveStat = ['wins', 'points', 'goalsScored'].includes(stat);
        document.getElementById('card-table').remove();
        const statEval = isLeftButton ? statEvaluation(leftStat, rightStat, positiveStat) : statEvaluation(rightStat, leftStat, positiveStat);

        if(leftStat === rightStat){
            score = score+=1;
            scoreCounter.textContent = score;
            cardContainer.textContent = 'It\'s a tie! Free point! Try another!';
        } else if(isLeftButton && statEval || !isLeftButton && statEval) {
            score = score+=1;
            scoreCounter.textContent = score;
            cardContainer.textContent = 'Correct! Try another!';
        } else {
            cardContainer.textContent = 'Oh no! That\'s wrong! Try another!';
        }
    }

    function statEvaluation(stat1, stat2, positiveStat){
        if(positiveStat){
            if(stat1 > stat2) return true;
        } else {
            if(stat1 < stat2) return true;
        }  
        return false
    }

    function createTable(){
        const tableElement = document.createElement('table');
        tableElement.id = 'card-table';
        
        for(let i = 1; i < 4; i++){
            buildTableStructure(i, tableElement);
        }

        return tableElement;
    }

    function buildTableStructure(iterator, tableElement){
        const tr = document.createElement('tr');
        const buttonLeft = document.createElement('button');
        const buttonRight = document.createElement('button');
        buttonLeft.id = 'button-left';
        buttonLeft.className = 'button';
        buttonLeft.textContent = 'This Team!';
        buttonRight.id = 'button-right';
        buttonRight.className = 'button';
        buttonRight.textContent = 'No, This Team!';

        for(let j = 1; j < 4; j++){
            const td = document.createElement('td');
            td.id = `cell-${iterator}${j}`;

            if(td.id === 'cell-31'){
                td.appendChild(buttonLeft);
            } else if(td.id === 'cell-33'){
                td.appendChild(buttonRight);
            }

            tr.appendChild(td);
        }

        tableElement.appendChild(tr);
    }

    function chooseRandomValue(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function formatStat(statName){
        return ['goalsScored', 'goalsAgainst'].includes(statName) ? statName.charAt(0).toUpperCase() + statName.slice(1,5) + ' ' + statName.slice(5) : statName.charAt(0).toUpperCase() + statName.slice(1);
    }
}

addEventListener('DOMContentLoaded', init);