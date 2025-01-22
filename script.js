const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Object that stores values of minimum and maximum angle for a value
const rotationValues = [
    { minDegree: 0, maxDegree: 30, value: 'Hard Luck' },
    { minDegree: 31, maxDegree: 90, value: 'Voucher' },
    { minDegree: 91, maxDegree: 150, value: 'Play Again' },
    { minDegree: 151, maxDegree: 210, value: 'Hard Luck' },
    { minDegree: 211, maxDegree: 270, value: 'Box 12' },
    { minDegree: 271, maxDegree: 330, value: '10% discount' },
    { minDegree: 331, maxDegree: 360, value: 'Hard Luck' },
];

// Size of each piece
const data = [16, 16, 16, 16, 16, 16];

// Background color for each piece
var pieColors = [
    "#000000", "#005c00", "#a30000", "#000000", "#005c00", "#a30000"
];

// Check if the user has already spun and redirect if so
if (localStorage.getItem("hasSpun") === "true") {
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSfEA_t1-tHXRjgGsLR0gHO4k-6l2INa27REjnAiFXbw9izYkQ/viewform?usp=header";
}

let myChart = new Chart(wheel, {
    plugins: [ChartDataLabels],
    type: "pie",
    data: {
        labels: ['Voucher', 'Hard Luck', '10% discount', 'Box 12', 'Hard Luck', 'Play Again'],
        datasets: [
            {
                backgroundColor: pieColors,
                data: data,
            },
        ],
    },
    options: {
        responsive: true,
        animation: { duration: 0 },
        plugins: {
            tooltip: false,
            legend: { display: false },
            datalabels: {
                color: "#ffffff",
                formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                font: { size: 24 },
            },
        },
    },
});

// Display value based on the randomAngle
const valueGenerator = (angleValue) => {
    for (let i of rotationValues) {
        if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
            finalValue.innerHTML = `<p>The color is: ${i.value}</p>`;
            break;
        }
    }
};

// Spinner count
let count = 0;
let resultValue = 101;
let hasSpun = false;  // Track if the wheel has been spun

// Start spinning
spinBtn.addEventListener("click", () => {
    if (hasSpun) return;  // Prevent spinning if already spun

    hasSpun = true;  // Mark that the wheel has been spun
    spinBtn.disabled = true;
    finalValue.innerHTML = `<p>Good Luck!</p>`;
    let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);

    let rotationInterval = window.setInterval(() => {
        myChart.options.rotation = myChart.options.rotation + resultValue;
        myChart.update();

        if (myChart.options.rotation >= 360) {
            count += 1;
            resultValue -= 5;
            myChart.options.rotation = 0;
        } else if (count > 15 && myChart.options.rotation == randomDegree) {
            valueGenerator(randomDegree);
            clearInterval(rotationInterval);
            count = 0;
            resultValue = 101;

            // Redirect to Google Forms after spin
            localStorage.setItem("hasSpun", "true"); // Mark that the user has spun
            window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSfEA_t1-tHXRjgGsLR0gHO4k-6l2INa27REjnAiFXbw9izYkQ/viewform?usp=header";
        }
    }, 10);
});
