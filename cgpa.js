// cgpa.js - Integrated and functional script with all features

// Grade points mapping
const gradePoints = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2,
    'E': 1,
    'F': 0
};

// Advice arrays
const highEffortAdvice = [
    "Focus on understanding core concepts deeply to aim for top grades.",
    "Create a strict study schedule and stick to it religiously.",
    "Seek help from professors or tutors for challenging subjects.",
    "Practice past exam papers extensively to build confidence.",
    "Form study groups with high-achieving peers.",
    "Prioritize sleep and health to maintain peak performance.",
    "Use active recall techniques for better retention.",
    "Break down complex topics into manageable parts.",
    "Set daily goals and track your progress.",
    "Eliminate distractions during study sessions.",
    "Review notes regularly to reinforce learning.",
    "Engage in extracurriculars that enhance your skills.",
    "Utilize online resources for additional explanations.",
    "Stay motivated by visualizing your success.",
    "Manage time effectively during exams.",
    "Focus on weak areas first in your study plan.",
    "Incorporate breaks to avoid burnout.",
    "Track your improvements over time.",
    "Seek feedback on assignments to improve.",
    "Maintain a positive mindset throughout."
];

const mediumEffortAdvice = [
    "Balance study time with relaxation to stay consistent.",
    "Review class materials weekly to stay on track.",
    "Participate actively in class discussions.",
    "Use flashcards for quick revisions.",
    "Organize your study space for efficiency.",
    "Set realistic goals for each semester.",
    "Collaborate with classmates on projects.",
    "Incorporate variety in study methods.",
    "Monitor your progress with self-tests.",
    "Reward yourself for meeting milestones.",
    "Stay updated with course announcements.",
    "Practice time management skills daily.",
    "Read supplementary materials for depth.",
    "Join academic clubs related to your field.",
    "Keep a journal of learned concepts.",
    "Discuss topics with friends to reinforce.",
    "Use apps for productivity tracking.",
    "Focus on understanding over memorization.",
    "Prepare early for assessments.",
    "Reflect on mistakes to learn from them."
];

const lowEffortAdvice = [
    "Maintain your current study habits as they work well.",
    "Continue consistent revision to sustain performance.",
    "Stay engaged in classes for easy retention.",
    "Use summaries for quick reviews.",
    "Keep your materials organized.",
    "Set minor goals to keep momentum.",
    "Share knowledge with others.",
    "Explore topics of interest further.",
    "Track overall academic trends.",
    "Celebrate small victories.",
    "Follow course updates casually.",
    "Practice light time management.",
    "Read lightly on related subjects.",
    "Participate in casual study groups.",
    "Note key takeaways daily.",
    "Discuss casually with peers.",
    "Use basic productivity tools.",
    "Emphasize conceptual clarity.",
    "Start prep a bit ahead.",
    "Learn from past successes."
];

// Function to get random advice
function getRandomAdvice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Variables
let courseCount = 3;
let semesterCount = 0;
let sgpaChart;
let cgpaTrendChart;
let sgpaCharts = []; // Array for individual SGPA chart instances
let sgpaDataList = []; // Store data for each SGPA calculation
const maxSemesters = 10;
const sgpaTableBody = document.querySelector('#sgpa-table tbody');
const levelSelect = document.getElementById('current-level');
const popupModal = document.getElementById('popup-modal');
const popupMessage = document.getElementById('popup-message');
const addMoreBtn = document.getElementById('add-more-btn');
const proceedBtn = document.getElementById('proceed-btn');
let lastAddedType = ''; // 'calculated' or 'direct'
let isProceeding = false;

// Disable buttons until level selected
const disableButtons = () => {
    document.getElementById('add-course-button').disabled = true;
    document.getElementById('calculate-sgpa-button').disabled = true;
    document.getElementById('add-to-table-button').disabled = true;
    document.getElementById('add-direct-to-table-button').disabled = true;
    document.getElementById('calculate-cgpa-button').disabled = true;
    document.getElementById('predict-button').disabled = true;
};

const enableButtons = () => {
    document.getElementById('add-course-button').disabled = false;
    document.getElementById('calculate-sgpa-button').disabled = false;
    document.getElementById('add-to-table-button').disabled = false;
    document.getElementById('add-direct-to-table-button').disabled = false;
    document.getElementById('calculate-cgpa-button').disabled = false;
    document.getElementById('predict-button').disabled = false;
};

disableButtons();

levelSelect.addEventListener('change', () => {
    if (levelSelect.value) {
        enableButtons();
    } else {
        disableButtons();
    }
    updateSemestersLeft();
});

// Add course dynamically
document.getElementById('add-course-button').addEventListener('click', () => {
    courseCount++;
    const form = document.getElementById('sgpa-form');
    const labelGrade = document.createElement('label');
    labelGrade.htmlFor = `grade${courseCount}`;
    labelGrade.textContent = `Grade ${courseCount}:`;
    const selectGrade = document.createElement('select');
    selectGrade.id = `grade${courseCount}`;
    selectGrade.className = 'grade-field';
    selectGrade.name = `grade${courseCount}`;
    selectGrade.innerHTML = `
        <option value="">--Select--</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="E">E</option>
        <option value="F">F</option>
    `;
    const labelCredit = document.createElement('label');
    labelCredit.htmlFor = `credit${courseCount}`;
    labelCredit.textContent = `Credit ${courseCount}:`;
    const inputCredit = document.createElement('input');
    inputCredit.type = 'number';
    inputCredit.id = `credit${courseCount}`;
    inputCredit.className = 'credit-field';
    inputCredit.name = `credit${courseCount}`;
    inputCredit.min = '0';
    inputCredit.placeholder = 'e.g. 3';

    form.insertBefore(labelGrade, document.getElementById('add-course-button'));
    form.insertBefore(selectGrade, document.getElementById('add-course-button'));
    form.insertBefore(labelCredit, document.getElementById('add-course-button'));
    form.insertBefore(inputCredit, document.getElementById('add-course-button'));
});

// Calculate SGPA
document.getElementById('calculate-sgpa-button').addEventListener('click', () => {
    if (!levelSelect.value) {
        alert('Please select your current level.');
        return;
    }
    let totalPoints = 0;
    let totalCredits = 0;
    let courseData = [];
    for (let i = 1; i <= courseCount; i++) {
        const gradeElem = document.getElementById(`grade${i}`);
        const creditElem = document.getElementById(`credit${i}`);
        if (gradeElem && creditElem) {
            const grade = gradeElem.value;
            const credit = parseFloat(creditElem.value) || 0;
            if (grade && credit > 0) {
                const points = gradePoints[grade] * credit;
                const maxPoints = 5 * credit;
                courseData.push({ course: `Course ${i}`, points, maxPoints, credit });
                totalPoints += points;
                totalCredits += credit;
            }
        }
    }
    const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    document.getElementById('sgpa-result').textContent = `Your SGPA: ${sgpa}`;

    // Store data and create chart
    sgpaDataList.push(courseData);
    createSgpaChart(courseData, sgpaDataList.length);
});

// Create individual SGPA chart
function createSgpaChart(courseData, index) {
    const container = document.getElementById('sgpa-charts-container');
    const canvas = document.createElement('canvas');
    canvas.id = `sgpa-chart-${index}`;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: courseData.map(d => d.course),
            datasets: [
                { label: 'Points Obtained', data: courseData.map(d => d.points), backgroundColor: 'rgba(0, 123, 255, 0.6)' },
                { label: 'Max Points', data: courseData.map(d => d.maxPoints), backgroundColor: 'rgba(200, 200, 200, 0.6)' }
            ]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                title: { display: true, text: `SGPA Breakdown - Semester ${index}` }
            }
        }
    });
    sgpaCharts.push(chart);
}

// Add to table (calculated)
document.getElementById('add-to-table-button').addEventListener('click', () => {
    const sgpaText = document.getElementById('sgpa-result').textContent;
    const sgpa = sgpaText.split(': ')[1];
    if (sgpa && !isNaN(sgpa)) {
        if (semesterCount >= maxSemesters) {
            alert('Maximum 10 semesters allowed.');
            return;
        }
        addToTable(sgpa);
        lastAddedType = 'calculated';
        showPopup(`SGPA ${sgpa} added successfully!`);
    } else {
        alert('Please calculate SGPA first.');
    }
});

// Add direct to table
document.getElementById('add-direct-to-table-button').addEventListener('click', () => {
    const directSgpa = document.getElementById('direct-sgpa').value;
    if (directSgpa && !isNaN(directSgpa) && directSgpa >= 0 && directSgpa <= 5) {
        if (semesterCount >= maxSemesters) {
            alert('Maximum 10 semesters allowed.');
            return;
        }
        addToTable(parseFloat(directSgpa).toFixed(2));
        document.getElementById('direct-sgpa').value = ''; // Clear after adding
        lastAddedType = 'direct';
        showPopup(`SGPA ${directSgpa} added successfully!`);
    } else {
        alert('Please enter a valid SGPA between 0 and 5.');
    }
});

// Add to table function
function addToTable(sgpa) {
    semesterCount++;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>Semester ${semesterCount}</td>
        <td>${sgpa}</td>
        <td><button class="remove-button">Remove</button></td>
    `;
    sgpaTableBody.appendChild(row);
    row.querySelector('.remove-button').addEventListener('click', () => {
        row.remove();
        semesterCount--;
        updateChart();
        updateSemestersLeft();
    });
    updateChart();
    updateSemestersLeft();
}

// Show popup based on level and count
function showPopup(message) {
    popupMessage.textContent = message;
    const level = parseInt(levelSelect.value);
    const is100L = level === 100;
    const minSgpAs = is100L ? 1 : 2;

    if (semesterCount < minSgpAs) {
        proceedBtn.style.display = 'none';
    } else {
        proceedBtn.style.display = 'inline-block';
    }

    popupModal.style.display = 'flex';
}

// Popup buttons
addMoreBtn.addEventListener('click', () => {
    popupModal.style.display = 'none';
    if (lastAddedType === 'calculated') {
        document.getElementById('sgpa-form').reset();
        document.getElementById('sgpa-result').textContent = '';
        for (let i = courseCount; i > 3; i--) {
            document.getElementById(`grade${i}`).remove();
            document.getElementById(`credit${i}`).remove();
            document.querySelector(`label[for="grade${i}"]`).remove();
            document.querySelector(`label[for="credit${i}"]`).remove();
        }
        courseCount = 3;
    } else if (lastAddedType === 'direct') {
        document.getElementById('direct-sgpa').value = '';
    }
    isProceeding = false;
});

proceedBtn.addEventListener('click', () => {
    popupModal.style.display = 'none';
    isProceeding = true;
    // Retain values
});

// Calculate CGPA
document.getElementById('calculate-cgpa-button').addEventListener('click', () => {
    const sgpas = Array.from(sgpaTableBody.querySelectorAll('tr td:nth-child(2)')).map(td => parseFloat(td.textContent));
    if (sgpas.length > 0) {
        const cgpa = (sgpas.reduce((a, b) => a + b, 0) / sgpas.length).toFixed(2);
        document.getElementById('cgpa-result').textContent = `Your CGPA: ${cgpa}`;
        updateCgpaTrendChart();
    } else {
        alert('Add at least one SGPA to the table.');
    }
});

// Update main SGPA chart
function updateChart() {
    const labels = Array.from(sgpaTableBody.querySelectorAll('tr td:nth-child(1)')).map(td => td.textContent);
    const data = Array.from(sgpaTableBody.querySelectorAll('tr td:nth-child(2)')).map(td => parseFloat(td.textContent));
    const ctx = document.getElementById('sgpa-chart').getContext('2d');
    if (sgpaChart) {
        sgpaChart.destroy();
    }
    sgpaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'SGPA',
                data: data,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                fill: true
            }]
        },
        options: {
            scales: {
                y: { min: 0, max: 5 }
            }
        }
    });
}

// Update CGPA trend chart
function updateCgpaTrendChart() {
    const sgpas = Array.from(sgpaTableBody.querySelectorAll('tr td:nth-child(2)')).map(td => parseFloat(td.textContent));
    if (sgpas.length === 0) return;
    const cumulative = [];
    sgpas.reduce((acc, val, i) => {
        cumulative[i] = ((acc * i + val) / (i + 1)).toFixed(2);
        return cumulative[i];
    }, 0);
    const ctx = document.getElementById('cgpa-trend-chart').getContext('2d');
    if (cgpaTrendChart) cgpaTrendChart.destroy();
    cgpaTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sgpas.map((_, i) => `Sem ${i+1}`),
            datasets: [{ label: 'Cumulative CGPA', data: cumulative, borderColor: '#28a745' }]
        },
        options: {
            scales: {
                y: { 
                    min: 0, 
                    max: 5, 
                    ticks: {
                        stepSize: 0.5
                    }
                }
            }
        }
    });
}

// View Chart
document.getElementById('view-chart-button').addEventListener('click', () => {
    const container = document.getElementById('chart-container');
    container.classList.toggle('visible');
    if (container.classList.contains('visible') && sgpaChart) {
        sgpaChart.update();
    }
    if (container.classList.contains('visible') && cgpaTrendChart) {
        cgpaTrendChart.update();
    }
});

// Update semesters left
function updateSemestersLeft() {
    const semsLeftInput = document.getElementById('semesters-left');
    const remaining = maxSemesters - semesterCount;
    if (semesterCount === 0) {
        semsLeftInput.readOnly = false;
        semsLeftInput.min = 1;
        semsLeftInput.max = 10;
        semsLeftInput.placeholder = '1-10';
        semsLeftInput.value = '';
    } else {
        semsLeftInput.value = remaining > 0 ? remaining : 0;
        semsLeftInput.readOnly = true;
    }
}

// Predict Required SGPA
document.getElementById('predict-button').addEventListener('click', () => {
    if (!levelSelect.value) {
        alert('Please select your current level.');
        return;
    }
    const desiredCgpa = parseFloat(document.getElementById('desired-cgpa').value);
    let semsLeft = parseInt(document.getElementById('semesters-left').value);
    const sgpas = Array.from(sgpaTableBody.querySelectorAll('tr td:nth-child(2)')).map(td => parseFloat(td.textContent));
    const numSems = sgpas.length;
    if (numSems === 0 && (isNaN(semsLeft) || semsLeft < 1 || semsLeft > 10)) {
        alert('Please enter semesters left between 1 and 10 when no SGPAs are added.');
        return;
    }
    if (numSems > 0) {
        semsLeft = maxSemesters - numSems;
    }
    if (numSems > 0 && !isNaN(desiredCgpa) && semsLeft > 0) {
        const currentCgpa = (sgpas.reduce((a, b) => a + b, 0) / numSems);
        const required = ((desiredCgpa * (numSems + semsLeft)) - (currentCgpa * numSems)) / semsLeft;
        const requiredFixed = Math.max(0, Math.min(5, required.toFixed(2)));
        document.getElementById('predict-result').textContent = `Required average SGPA for remaining semesters: ${requiredFixed}`;

        // Dynamic advice
        const userName = document.getElementById('user-name').value.trim() || 'User';
        let adviceArray;
        if (required > 4.0) {
            adviceArray = highEffortAdvice;
        } else if (required >= 3.0) {
            adviceArray = mediumEffortAdvice;
        } else {
            adviceArray = lowEffortAdvice;
        }
        const randomAdvice = getRandomAdvice(adviceArray);
        let adviceText = `${userName}, to achieve your desired CGPA of ${desiredCgpa}, you need to aim for an average SGPA of ${requiredFixed} in the next ${semsLeft} semesters. Tip: ${randomAdvice}`;
        if (required > 5) {
            adviceText += ' Note: This is above the maximum possible SGPA (5.0), so it may not be achievable.';
        } else if (required < 0) {
            adviceText += ' Great job! Your current performance already exceeds the requirement.';
        }
        document.getElementById('advice').textContent = adviceText;
    } else {
        alert('Please add SGPAs to the table or enter semesters left, and a valid desired CGPA.');
    }
});

// Clear All
document.getElementById('clear-all-button').addEventListener('click', () => {
    // Reset SGPA form
    for (let i = courseCount; i > 3; i--) {
        document.getElementById(`grade${i}`).remove();
        document.getElementById(`credit${i}`).remove();
        document.querySelector(`label[for="grade${i}"]`).remove();
        document.querySelector(`label[for="credit${i}"]`).remove();
    }
    courseCount = 3;
    document.getElementById('sgpa-form').reset();
    document.getElementById('sgpa-result').textContent = '';

    // Reset table
    sgpaTableBody.innerHTML = '';
    semesterCount = 0;

    // Reset results
    document.getElementById('cgpa-result').textContent = '';
    document.getElementById('predict-result').textContent = '';
    document.getElementById('advice').textContent = '';
    document.getElementById('direct-sgpa').value = '';
    document.getElementById('desired-cgpa').value = '';
    document.getElementById('semesters-left').value = '';

    // Hide chart
    document.getElementById('chart-container').classList.remove('visible');
    if (sgpaChart) sgpaChart.destroy();
    if (cgpaTrendChart) cgpaTrendChart.destroy();

    // Clear SGPA charts
    document.getElementById('sgpa-charts-container').innerHTML = '';
    sgpaDataList = [];
    sgpaCharts.forEach(chart => chart.destroy());
    sgpaCharts = [];

    updateSemestersLeft();
});

// Initial call
updateSemestersLeft();

