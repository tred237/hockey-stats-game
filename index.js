const init = () => {
    const getCurrentDate = () => {
        const date = new Date();
        let year = date.getFullYear().toString();
        let month = date.getMonth().toString().length === 1 ? `0${date.getMonth().toString()}` : date.getMonth().toString();
        let day = date.getDate().toString().length === 1 ? `0${date.getDate().toString()}` : date.getDate().toString();
        return `${year}${month}${day}`;
    }

    function createdDropDownElement (element, category) {
        const dropdown = document.getElementById(`${category}-dropdown`); 
        const option = document.createElement('option');
        option.value = element;
        option.textContent = element;
        dropdown.appendChild(option);
        dropdown.insertBefore(option, dropdown.children[1]);
    }

    function populateSeasonDropDown() {
        let seasonsEndPoint = 'https://statsapi.web.nhl.com/api/v1/seasons';
        fetch(seasonsEndPoint)
        .then(res => res.json())
        .then(data => {
            data.seasons.forEach(element => {
                if(element.seasonEndDate.replaceAll('-','') < getCurrentDate()) createdDropDownElement(element.seasonId, 'season');
            })
        })
    }


    const gameForm = document.getElementById('main-game-form');
    gameForm.addEventListener('submit', handleForm);

    function handleForm(e){
        e.preventDefault();
        if(document.querySelector('p')) document.querySelector('p').remove();

        const dropDownSelection = document.getElementById('season-dropdown').value;
        if(dropDownSelection === '') return alert('Need to choose a season');
        
        const p = document.createElement('p');
        p.textContent = dropDownSelection;
        document.getElementById('selection-container').appendChild(p);
    }


    populateSeasonDropDown();

}

addEventListener('DOMContentLoaded', init)