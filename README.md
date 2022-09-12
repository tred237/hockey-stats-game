# Hockey Stats Trivia Game

This game challenges a user's knowledge of hockey statistics. Once the user chooses a hockey season, they will be challenged to guess which of the two randomly chosen teams had the better score for the given statistic that season. If the user guesses the correct team, a point will added to their score. 

The data pulled for this application, comes from a public API that features statistics recorded from the National Hockey League. This application is by no means meant to be monetizable or for commercial use. It is for education purposes...and fun!

## Installation
1. At the top right of the GitHub repository screen create a new fork of the repository.

	![image](https://user-images.githubusercontent.com/103388556/189546584-8ec5fef7-4d7d-4c47-ae6b-f6e6ae834a69.png)

	![image](https://user-images.githubusercontent.com/103388556/189546761-f0f05411-1967-46c7-b081-063bc6951ae0.png)


2. Copy the SSH key from the forked repository.

	![image](https://user-images.githubusercontent.com/103388556/189546817-4d32dcbb-e79e-4220-8fc2-c573d21e9cc1.png)


3. In your terminal, create a new directory, navigate to it, and clone the repository using the SSH key you copied from the fork.
	```
	mkdir hockey-stats-folder
	cd hockey-stats-game
	git clone <pasted-ssh-key>
	```

## Usage

Once you have cloned the repository, navigate to its root directory and open `index.html`
	
	cd hockey-stats-game
	open index.html

The application should look identical to the screenshot below.

![image](https://user-images.githubusercontent.com/103388556/189733615-0d3266c3-3e97-49b6-8ea9-7c62255759ee.png)

The user should be able to choose a season in the drop down. 
	
![image](https://user-images.githubusercontent.com/103388556/189733846-bc0b5069-409a-4a4f-9ba3-f2c7f085153c.png)

Once the user submits, two teams and a statistic should be presented, allowing the user to choose which team had the better statistic. If the user chose correctly, a point should be added to the score.

![image](https://user-images.githubusercontent.com/103388556/189734038-5391a62a-1082-4f3c-bd01-9b5609c74747.png)

If the user wants to reset the score, the "Clear Score" button will set it back to 0.

![image](https://user-images.githubusercontent.com/103388556/189734236-aa4913a0-ea5c-4a50-8fc2-0e6b39717526.png)

## Contributing
Contributions are welcome, but please open an issue first to discuss what you would like to change. If you fork the repository, please rememeber that this code is not meant to be monetizable or for commercial use.

## License/API
API: [nhlapi](https://gitlab.com/dword4/nhlapi)
