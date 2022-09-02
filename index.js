const init = () => {
    function createdDropDownElement (seasonId) {
        const seasonDropDown = document.getElementById('season-dropdown'); 
        const option = document.createElement('option');
        option.value = seasonId;
        option.textContent = seasonId;
        seasonDropDown.appendChild(option);
        seasonDropDown.insertBefore(option, seasonDropDown.children[1]);
    }

    function populateSeasonDropDown() {
        let seasonsEndPoint = 'https://statsapi.web.nhl.com/api/v1/seasons';
        fetch(seasonsEndPoint)
        .then(res => res.json())
        .then(data => {
            const date = new Date();
            let year = date.getFullYear().toString();
            let month = date.getMonth().toString().length === 1 ? `0${date.getMonth().toString()}` : date.getMonth().toString();
            let day = date.getDate().toString().length === 1 ? `0${date.getDate().toString()}` : date.getDate().toString();

            data.seasons.forEach(element => {
                if(element.seasonEndDate.replaceAll('-','') < `${year}${month}${day}`) createdDropDownElement(element.seasonId);
            })
        })
    }

    populateSeasonDropDown()

}

addEventListener('DOMContentLoaded', init)