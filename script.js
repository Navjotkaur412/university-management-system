// ==========================================
// LOAD COURSES FROM EXPRESS
// ==========================================

async function loadCourses() {

    try {

        const response = await fetch("/courses");

        const courses = await response.json();

        displayCourses(courses);

        updateStatistics(courses);

    } catch (error) {

        console.log("Error loading courses:", error);

        document.getElementById("courseContainer").innerHTML = `
            <div class="loading">
                Unable to load courses.
            </div>
        `;
    }
}


// ==========================================
// DISPLAY COURSES
// ==========================================

function displayCourses(courses) {

    const container =
        document.getElementById("courseContainer");

    container.innerHTML = "";


    if (courses.length === 0) {

        container.innerHTML = `
            <div class="loading">
                No courses found.
            </div>
        `;

        return;
    }


    courses.forEach(course => {

        let semestersHTML = "";


        course.semesters.forEach(semester => {

            let subjectsHTML = "";


            semester.subjects.forEach(subject => {

                subjectsHTML += `
                    <li>${subject}</li>
                `;

            });


            semestersHTML += `

                <div class="semester">

                    <h3>
                        ${semester.semesterName}
                    </h3>

                    <ul>
                        ${subjectsHTML}
                    </ul>

                </div>

            `;

        });


        container.innerHTML += `

            <div class="course-card">

                <h2 class="course-title">
                    ${course.courseName}
                </h2>

                <p class="duration">
                    ⏱ Duration: ${course.duration}
                </p>

                ${semestersHTML}

            </div>

        `;

    });

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics(courses) {

    let semesterCount = 0;

    let subjectCount = 0;


    courses.forEach(course => {

        semesterCount += course.semesters.length;


        course.semesters.forEach(semester => {

            subjectCount += semester.subjects.length;

        });

    });


    document.getElementById("courseCount").innerText =
        courses.length;

    document.getElementById("semesterCount").innerText =
        semesterCount;

    document.getElementById("subjectCount").innerText =
        subjectCount;

}


// ==========================================
// SEARCH COURSES
// ==========================================

document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const searchText =
            this.value.toLowerCase();


        const cards =
            document.querySelectorAll(".course-card");


        cards.forEach(card => {

            const courseName =
                card
                    .querySelector(".course-title")
                    .innerText
                    .toLowerCase();


            if (courseName.includes(searchText)) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });


// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

loadCourses();