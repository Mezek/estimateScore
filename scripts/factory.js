
function createCar(numberOfDoors){
	var numberOfWheels = 4;

	function describe(){
		return "I have " + numberOfWheels +
			" wheels and " + numberOfDoors + " doors.";
	}

	return {
		describe: describe
	};
}

function createOdometer(){
	var mileage = 100;

	function increment(numberOfMiles){ mileage += numberOfMiles; }
	function report(){ return mileage; }

	return {
		increment: increment,
		report: report
	}
}

function createCarWithOdometer(numberOfDoors){
	var odometer = createOdometer();
	var car = createCar(numberOfDoors);

	car.drive = function(numberOfMiles){
		odometer.increment(numberOfMiles);
	};

	car.mileage = function(){
		return "car has driven " + odometer.report() + " miles";
	};

	return car;
}

let mycar = createCarWithOdometer(10);
console.log(mycar.mileage());


//------------------

function createScoreTable() {
	var teams = [];
	var result = null;

	function showTeams() {
		console.log(teams);
	}
	function add() { console.log("Add"); }
	function reload(){}

	return Object.freeze({
		add,
		reload,
	});
}
