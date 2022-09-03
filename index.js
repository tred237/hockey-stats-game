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


    const gameForm = document.getElementById('main-game-form');
    gameForm.addEventListener('submit', handleForm);

    function handleForm(e){
        e.preventDefault();
        // if(document.querySelector('p')) document.querySelector('p').remove();  SAVE
        if(document.querySelectorAll('p')) document.querySelectorAll('p').forEach(element => element.remove())

        const dropDownSelection = document.getElementById('season-dropdown').value;
        if(dropDownSelection === '') return alert('Oops! You need to choose a valid season.');
        
        // const p = document.createElement('p');
        // p.textContent = dropDownSelection;
        // document.getElementById('selection-container').appendChild(p);
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
            const chosenStat = chooseRandomStat(statList);
            const chosenTeams = findTeamPairing(data);
            chosenTeams.forEach(element => retrieveTeamData(data, element, chosenStat))
        })
    }

    function findTeamPairing(seasonData){
        const teams = [];
        const chosenTeams = [];

        seasonData.records.forEach(element => element.teamRecords.forEach(innerElement => teams.push(innerElement.team.id))); //available teamids for seasons

        chosenTeams.push(chooseRandomTeam(teams));

        while(chosenTeams.length < 2){
            const newTeam = chooseRandomTeam(teams);
            if(! chosenTeams.includes(newTeam)) chosenTeams.push(newTeam);
        }
        return chosenTeams;
    }

    function chooseRandomTeam(teamsList){
        return teamsList[Math.floor(Math.random() * teamsList.length)]
    }

    function chooseRandomStat(stat){
        return stat[Math.floor(Math.random() * stat.length)]
    }

    // checks which team the id is attached to and pulls the name and wins for that team/season
    function retrieveTeamData(seasonData, teamId, stat){
        seasonData.records.forEach(element => element.teamRecords.forEach(innerElement => {
            if(innerElement.team.id === teamId){
                const p = document.createElement('p');
                stat === 'wins' || stat === 'losses' ? p.textContent = `${innerElement.team.name} , ${innerElement.leagueRecord[stat]}` : p.textContent = `${innerElement.team.name} , ${innerElement[stat]}`;
                document.getElementById('selection-container').appendChild(p);
            }
        }))
    }




    populateSeasonDropDown();

}

addEventListener('DOMContentLoaded', init);