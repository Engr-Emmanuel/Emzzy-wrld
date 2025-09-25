let currentSgpa = null; // Store the latest calculated SGPA
let sgpas = []; // Array to store SGPA values for table, chart, and predictor
let chart = null; // For Chart.js instance

document.getElementById('add-course-button').addEventListener('click', addCourse);
document.getElementById('calculate-sgpa-button').addEventListener('click', calculateSGPA);
document.getElementById('add-to-table-button').addEventListener('click', () => addToTable(currentSgpa));
document.getElementById('add-direct-to-table-button').addEventListener('click', addDirectToTable);
document.getElementById('calculate-cgpa-button').addEventListener('click', calculateCGPA);
document.getElementById('view-chart-button').addEventListener('click', viewChart);
document.getElementById('predict-button').addEventListener('click', predictRequiredSGPA);
document.getElementById('clear-all-button').addEventListener('click', clearAll);

function addCourse() {
    const form = document.getElementById('sgpa-form');
    const addButton = document.getElementById('add-course-button');
    const courseNum = document.querySelectorAll('.grade-field').length + 1;

    const gradeLabel = document.createElement('label');
    gradeLabel.htmlFor = `grade${courseNum}`;
    gradeLabel.textContent = `Grade ${courseNum}:`;
    form.insertBefore(gradeLabel, addButton);

    const gradeSelect = document.createElement('select');
    gradeSelect.id = `grade${courseNum}`;
    gradeSelect.className = 'grade-field';
    gradeSelect.name = `grade${courseNum}`;
    const options = ['', 'A', 'B', 'C', 'D', 'E', 'F'];
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt ? opt : '--Select--';
        gradeSelect.appendChild(option);
    });
    form.insertBefore(gradeSelect, addButton);

    const creditLabel = document.createElement('label');
    creditLabel.htmlFor = `credit${courseNum}`;
    creditLabel.textContent = `Credit ${courseNum}:`;
    form.insertBefore(creditLabel, addButton);

    const creditInput = document.createElement('input');
    creditInput.type = 'number';
    creditInput.id = `credit${courseNum}`;
    creditInput.className = 'credit-field';
    creditInput.name = `credit${courseNum}`;
    creditInput.min = '0';
    form.insertBefore(creditInput, addButton);
}

function calculateSGPA() {
    const gradeFields = document.querySelectorAll('.grade-field');
    const creditFields = document.querySelectorAll('.credit-field');
    const gradePointsMap = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'F': 0 };
    
    let totalPoints = 0;
    let totalCredits = 0;
    let validCourses = 0;

    for (let i = 0; i < gradeFields.length; i++) {
        const grade = gradeFields[i].value;
        const creditStr = creditFields[i].value;
        
        if (grade && creditStr) {
            const credit = parseFloat(creditStr);
            if (isNaN(credit) || credit <= 0) {
                alert('Credits must be a positive number.');
                return;
            }
            if (!(grade in gradePointsMap)) {
                alert('Invalid grade selected.');
                return;
            }
            
            totalPoints += gradePointsMap[grade] * credit;
            totalCredits += credit;
            validCourses++;
        }
    }

    if (validCourses === 0 || totalCredits === 0) {
        alert('Enter at least one valid course with grade and credits.');
        return;
    }

    currentSgpa = totalPoints / totalCredits;
    document.getElementById('sgpa-result').textContent = `Calculated SGPA: ${currentSgpa.toFixed(2)}`;
}

function addToTable(sgpa) {
    if (sgpa === null || isNaN(sgpa)) {
        alert('Calculate or enter a valid SGPA first.');
        return;
    }
    if (sgpas.length >= 10) {
        alert('Maximum of 10 semesters allowed.');
        return;
    }
    sgpas.push(sgpa);
    renderTable();
    resetSgpaForm();
    currentSgpa = null;
    document.getElementById('sgpa-result').textContent = '';
    document.getElementById('direct-sgpa').value = '';
}

function addDirectToTable() {
    const directSgpaStr = document.getElementById('direct-sgpa').value;
    const directSgpa = parseFloat(directSgpaStr);
    if (isNaN(directSgpa) || directSgpa < 0 || directSgpa > 5) {
        alert('Enter a valid SGPA between 0 and 5.');
        return;
    }
    addToTable(directSgpa);
}

function renderTable() {
    const tableBody = document.querySelector('#sgpa-table tbody');
    tableBody.innerHTML = '';
    sgpas.forEach((sgpa, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Semester ${index + 1}</td>
            <td>${sgpa.toFixed(2)}</td>
            <td><button type="button" class="remove-button" data-index="${index}">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', removeFromTable);
    });
}

function removeFromTable(event) {
    const index = parseInt(event.target.dataset.index);
    sgpas.splice(index, 1);
    renderTable();
}

function calculateCGPA() {
    if (sgpas.length === 0) {
        alert('Add at least one SGPA to the table.');
        return;
    }
    const totalSgpa = sgpas.reduce((sum, sgpa) => sum + sgpa, 0);
    const cgpa = totalSgpa / sgpas.length;
    document.getElementById('cgpa-result').textContent = `Calculated CGPA: ${cgpa.toFixed(2)}`;
}

function viewChart() {
    if (sgpas.length === 0) {
        alert('Add SGPAs to the table first.');
        return;
    }
    const chartContainer = document.getElementById('chart-container');
    chartContainer.style.display = 'block';

    const ctx = document.getElementById('sgpa-chart').getContext('2d');
    if (chart) chart.destroy(); // Destroy previous chart if exists

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sgpas.map((_, index) => `Semester ${index + 1}`),
            datasets: [{
                label: 'SGPA Trend',
                data: sgpas,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }]
        },
        options: {
            scales: {
                y: { min: 0, max: 5 }
            }
        }
    });
}

function predictRequiredSGPA() {
    const desiredCgpaStr = document.getElementById('desired-cgpa').value;
    const semestersLeftStr = document.getElementById('semesters-left').value;
    const desiredCgpa = parseFloat(desiredCgpaStr);
    const semestersLeft = parseInt(semestersLeftStr);

    if (isNaN(desiredCgpa) || desiredCgpa < 0 || desiredCgpa > 5) {
        alert('Enter a valid desired CGPA between 0 and 5.');
        return;
    }
    if (isNaN(semestersLeft) || semestersLeft < 1 || semestersLeft > 10 - sgpas.length) {
        alert(`Enter valid semesters left (1 to ${10 - sgpas.length}).`);
        return;
    }

    const pastCount = sgpas.length;
    const pastSum = sgpas.reduce((sum, sgpa) => sum + sgpa, 0);
    const totalSemesters = pastCount + semestersLeft;
    const requiredTotalSum = desiredCgpa * totalSemesters;
    const requiredRemainingSum = requiredTotalSum - pastSum;
    let requiredSgpa = requiredRemainingSum / semestersLeft;

    let predictMessage = '';
    let adviceMessage = '';

    if (requiredSgpa > 5) {
        predictMessage = 'Impossible to achieve: Required SGPA exceeds 5.0.';
        adviceMessage = 'Consider adjusting your desired CGPA lower, as perfection beyond 5.0 is not possible.';
    } else if (requiredSgpa <= 0) {
        predictMessage = 'Already achieved: Your current CGPA exceeds the desired.';
        adviceMessage = 'Maintain your performance to stay above the target.';
    } else {
        predictMessage = `Minimum consistent SGPA required: ${requiredSgpa.toFixed(2)}`;
        const level = getLevel(requiredSgpa);
        adviceMessage = getAdvice(level);
    }

    document.getElementById('predict-result').textContent = predictMessage;
    document.getElementById('advice').textContent = adviceMessage;
}

function getLevel(sgpa) {
    if (sgpa >= 1.0 && sgpa <= 1.99) return 1;
    if (sgpa >= 2.0 && sgpa <= 2.99) return 2;
    if (sgpa >= 3.0 && sgpa <= 3.99) return 3;
    if (sgpa >= 4.0 && sgpa <= 4.49) return 4;
    if (sgpa >= 4.5 && sgpa <= 4.79) return 5;
    if (sgpa >= 4.8 && sgpa <= 5.0) return 6;
    return 0; // Fallback
}

function getAdvice(level) {
    switch (level) {
        case 1: return 'Level 1: Relatively easy to attain with minimal effort and basic passing grades.';
        case 2: return 'Level 2: Achievable with regular attendance and moderate studying.';
        case 3: return 'Level 3: Requires consistent effort, good understanding of material, and timely assignments.';
        case 4: return 'Level 4: Challenging; demands consistent reading, dedication, and strong time management.';
        case 5: return 'Level 5: Very demanding; needs high dedication, daily study routines, and seeking help when needed.';
        case 6: return 'Level 6: Mathematically possible but practically impossible in the real world due to the need for near-perfect scores every time, factoring in unforeseen challenges like health or course difficulty.';
        default: return '';
    }
}

function resetSgpaForm() {
    document.getElementById('sgpa-form').reset();
}

function clearAll() {
    resetSgpaForm();
    document.getElementById('sgpa-result').textContent = '';
    document.getElementById('cgpa-result').textContent = '';
    document.getElementById('predict-result').textContent = '';
    document.getElementById('advice').textContent = '';
    document.getElementById('direct-sgpa').value = '';
    document.getElementById('desired-cgpa').value = '';
    document.getElementById('semesters-left').value = '';
    sgpas = [];
    renderTable();
    if (chart) chart.destroy();
    document.getElementById('chart-container').style.display = 'none';
    currentSgpa = null;
}

