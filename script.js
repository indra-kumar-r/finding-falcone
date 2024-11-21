const data = {
    destinations: {
        Donlon: 100,
        Enchai: 200,
        Jebing: 300,
        Sapir: 400,
        Lerbin: 500,
        Pingasor: 600,
    },
    vehicles: {
        "Space pod": { available: 2, maxDistance: 200 },
        "Space rocket": { available: 1, maxDistance: 300 },
        "Space shuttle": { available: 1, maxDistance: 400 },
        "Space ship": { available: 2, maxDistance: 600 },
    },
};

function generateDropdowns() {
    const container = document.getElementById("destination-vehicle-container");
    container.innerHTML = "";

    for (let i = 1; i <= 4; i++) {
        const destinationSection = document.createElement("div");
        destinationSection.classList.add("destination-vehicle-section");

        // Create destination label and dropdown
        const destinationLabel = document.createElement("label");
        destinationLabel.textContent = `Destination ${i}`;
        const destinationSelect = document.createElement("select");
        destinationSelect.id = `destination${i}`;
        destinationSelect.classList.add("destination-dropdown");
        destinationSelect.innerHTML =
            '<option hidden value="">Select Destination</option>';

        for (const [dest, maxDist] of Object.entries(data.destinations)) {
            const option = document.createElement("option");
            option.value = dest;
            option.textContent = `${dest}`;
            option.dataset.maxDistance = maxDist;
            destinationSelect.appendChild(option);
        }

        // Create vehicle dropdown
        const vehicleSelect = document.createElement("select");
        vehicleSelect.id = `vehicle${i}`;
        vehicleSelect.classList.add("vehicle-dropdown");
        vehicleSelect.innerHTML =
            '<option hidden value="">Select Vehicle</option>';

        for (const [vehicle, { available, maxDistance }] of Object.entries(
            data.vehicles
        )) {
            const option = document.createElement("option");
            option.value = vehicle;
            option.textContent = `${vehicle}`;
            option.dataset.maxDistance = maxDistance;
            vehicleSelect.appendChild(option);
        }

        destinationSection.append(
            destinationLabel,
            destinationSelect,
            vehicleSelect
        );
        container.appendChild(destinationSection);
    }

    setupEventListeners();
    disableDropdowns();
}

function disableDropdowns() {
    // Initially disable all except first destination and vehicle
    const allDestinationSelects = document.querySelectorAll(
        ".destination-dropdown"
    );
    const allVehicleSelects = document.querySelectorAll(".vehicle-dropdown");

    allDestinationSelects.forEach((select, index) => {
        if (index !== 0) select.disabled = true; // Disable all except the first destination
    });

    allVehicleSelects.forEach((select) => {
        select.disabled = true; // Disable all vehicle selects initially
    });
}

function updateAvailableOptions() {
    const selectedDestinations = Array.from(
        document.querySelectorAll(".destination-dropdown")
    ).map((select) => select.value);
    const selectedVehicles = Array.from(
        document.querySelectorAll(".vehicle-dropdown")
    ).map((select) => select.value);

    // Disable destinations that have already been selected
    document.querySelectorAll(".destination-dropdown").forEach((dropdown) => {
        const options = dropdown.querySelectorAll("option");
        options.forEach((option) => {
            const destination = option.value;
            option.disabled = selectedDestinations.includes(destination);
            option.hidden = selectedDestinations.includes(destination);
        });
    });

    // Enable the next destination and vehicle dropdowns if the current one is selected
    document
        .querySelectorAll(".destination-dropdown")
        .forEach((dropdown, index) => {
            if (dropdown.value) {
                // Enable the next destination and its vehicle dropdown
                if (index + 1 < 4) {
                    document.getElementById(
                        `destination${index + 2}`
                    ).disabled = false;
                    document.getElementById(
                        `vehicle${index + 1}`
                    ).disabled = false;
                }
                // Enable the last vehicle if it's the last destination
                if (index === 3) {
                    document.getElementById(
                        `vehicle${index + 1}`
                    ).disabled = false;
                }
            }
        });

    document
        .querySelectorAll(".vehicle-dropdown")
        .forEach((dropdown, index) => {
            const selectedDestination = document.getElementById(
                `destination${index + 1}`
            ).value;
            const vehicleOptions = dropdown.querySelectorAll("option");

            vehicleOptions.forEach((option) => {
                const vehicle = option.value;
                const maxDistance = option.dataset.maxDistance;
                const availableCount = data.vehicles[vehicle].available;

                option.disabled =
                    selectedDestination &&
                    selectedDestination !== "" &&
                    (data.destinations[selectedDestination] < maxDistance ||
                        availableCount <= 0 ||
                        selectedVehicles.includes(vehicle));
            });
        });

    updateVehicleAvailability();
}

function updateVehicleAvailability() {
    document.querySelectorAll(".vehicle-dropdown").forEach((dropdown) => {
        const selectedVehicle = dropdown.value;
        if (selectedVehicle) {
            data.vehicles[selectedVehicle].available--;

            if (data.vehicles[selectedVehicle].available <= 0) {
                removeVehicleOption(selectedVehicle);
            }
        }
    });
}

function removeVehicleOption(vehicle) {
    document.querySelectorAll(".vehicle-dropdown").forEach((dropdown) => {
        const options = dropdown.querySelectorAll("option");
        options.forEach((option) => {
            if (option.value === vehicle) {
                option.disabled = true;
            }
        });
    });
}

function handleFormSubmit() {
    const selectedDestinations = [];
    const selectedVehicles = [];

    document
        .querySelectorAll(".destination-dropdown")
        .forEach((dropdown, index) => {
            const destination = dropdown.value;
            const vehicle = document.getElementById(
                `vehicle${index + 1}`
            ).value;

            if (destination !== "" && vehicle !== "") {
                selectedDestinations.push(destination);
                selectedVehicles.push(vehicle);
            }
        });

    if (selectedDestinations.length === 4 && selectedVehicles.length === 4) {
        let resultText = "Successfully selected destinations and vehicles.";
        document.getElementById("result").innerText = resultText;
    } else {
        document.getElementById("result").innerText =
            "Please select both a destination and a vehicle for each option.";
    }
}

function setupEventListeners() {
    document
        .querySelectorAll(".destination-dropdown, .vehicle-dropdown")
        .forEach((dropdown) => {
            dropdown.addEventListener("change", updateAvailableOptions);
        });

    document
        .getElementById("submitButton")
        .addEventListener("click", handleFormSubmit);
}

function resetPage() {
    window.location.reload();
}

generateDropdowns();
updateAvailableOptions();
