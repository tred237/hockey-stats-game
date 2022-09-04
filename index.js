const init = () => {
    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = date.getMonth().toString().length === 1 ? `0${date.getMonth().toString()}` : date.getMonth().toString();
        const day = date.getDate().toString().length === 1 ? `0${date.getDate().toString()}` : date.getDate().toString();
        return `${year}${month}${day}`;
    }

    function createDropDownElement (element, category) {
        const dropdown = document.getElementById(`${category}-dropdown`); 
        const option = document.createElement('option');
        option.value = element;
        option.textContent = `${element.slice(0,4)}-${element.slice(4)}`;
        dropdown.appendChild(option);
        dropdown.insertBefore(option, dropdown.children[1]);
    }

    function populateSeasonDropDown() {
        const seasonsEndPoint = 'https://statsapi.web.nhl.com/api/v1/seasons';
        fetch(seasonsEndPoint)
        .then(res => res.json())
        .then(data => {
            data.seasons.forEach(element => {
                if(element.seasonEndDate.replaceAll('-','') < getCurrentDate()) createDropDownElement(element.seasonId, 'season');
            })
        })
    }

    function handleForm(e){
        e.preventDefault();
        const submitButton = document.getElementById('submit-button');
        submitButton.disabled = true
        setTimeout(() => submitButton.disabled = false, 300)
        if(document.getElementById('card-container')) document.getElementById('card-container').remove();  //SAVE
        // if(document.querySelectorAll('p')) document.querySelectorAll('p').forEach(element => element.remove()) //SAVE

        const dropDownSelection = document.getElementById('season-dropdown').value;
        if(dropDownSelection === '') {
            submitButton.disabled = false;
            return alert('Oops! You need to choose a valid season.')
        }
        chooseTeamsOnSubmit(dropDownSelection);
    }

    function chooseTeamsOnSubmit(chosenSeason){
        //create an array to pull all of the available team ids in a season
        //randomly choose 2 ids in the array
        //add the ids and season to endpoint string
        // fetch('https://statsapi.web.nhl.com/api/v1/standings?20212022')
        const seasonEndPoint = `https://statsapi.web.nhl.com/api/v1/standings?season=${chosenSeason}`
        fetch(seasonEndPoint)
        .then(res => res.json())
        .then(data => {
            const statList = ['goalsScored', 'goalsAgainst', 'points', 'wins', 'losses'];
            const chosenTeamData = [];
            const chosenStat = chooseRandomValue(statList);
            const chosenTeams = findTeamPairing(data);
            chosenTeams.forEach(element => chosenTeamData.push(retrieveTeamData(data, element, chosenStat)));
            console.log(chosenTeamData)


            const selectionContainer = document.getElementById('selection-container')
            const cardContainer = document.createElement('div')
            cardContainer.id = 'card-container'
            cardContainer.className = 'container'

            const btn1 = document.createElement('button')
            const btn2 = document.createElement('button')

            btn1.addEventListener('click', e => {
                const scoreCounter = document.getElementById('score')
                if(chosenTeamData[0].statVal > chosenTeamData[1].statVal){
                    console.log('yay')
                    score = score+=1
                    scoreCounter.textContent = score
                    btn1.remove()
                    btn2.remove()
                } else {
                    console.log('boo')
                }
            })

            btn2.addEventListener('click', e => {
                const scoreCounter = document.getElementById('score')
                if(chosenTeamData[1].statVal > chosenTeamData[0].statVal){
                    console.log('yay')
                    score = score+=1
                    scoreCounter.textContent = score
                    btn1.remove()
                    btn2.remove()
                } else {
                    console.log('boo')
                }
            })

            cardContainer.appendChild(btn1)
            btn1.textContent = `choice 1`
            cardContainer.appendChild(btn2)
            btn2.textContent = `choice 2`
            selectionContainer.appendChild(cardContainer)




        })
    }

    function findTeamPairing(seasonData){
        const teams = [];
        const chosenTeams = [];

        seasonData.records.forEach(element => element.teamRecords.forEach(innerElement => teams.push(innerElement.team.id))); //available teamids for seasons

        chosenTeams.push(chooseRandomValue(teams));

        while(chosenTeams.length < 2){
            const newTeam = chooseRandomValue(teams);
            if(! chosenTeams.includes(newTeam)) chosenTeams.push(newTeam);
        }
        return chosenTeams;
    }

    function chooseRandomValue(arr){
        return arr[Math.floor(Math.random() * arr.length)]
    }

    // checks which team the id is attached to and pulls the name and wins for that team/season
    function retrieveTeamData(seasonData, teamId, stat){
        const teamObj = {};
        seasonData.records.forEach(element => element.teamRecords.forEach(innerElement => {
            if(innerElement.team.id === teamId){
                if(stat === 'wins' || stat === 'losses'){
                    teamObj.team = innerElement.team.name;
                    teamObj.stat = innerElement.leagueRecord[stat];
                    teamObj.statVal = innerElement.leagueRecord[stat];
                } else {
                    teamObj.team = innerElement.team.name;
                    teamObj.stat = stat;
                    teamObj.statVal = innerElement[stat];
                }
            }
        }))
        return teamObj;
    }

    let score = 0;
    document.getElementById('score').textContent = score;
    populateSeasonDropDown();
    const gameForm = document.getElementById('main-game-form');
    gameForm.addEventListener('submit', handleForm);

}

addEventListener('DOMContentLoaded', init);