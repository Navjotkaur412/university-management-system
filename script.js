// ==========================================
// STUDENTS CRUD
// ==========================================

let allStudents = [];

async function loadStudents() {

    try {

        const response = await fetch("/students");

        allStudents = await response.json();

        displayStudents(allStudents);

        document.getElementById("studentCount").innerText = allStudents.length;

    } catch (error) {

        console.log("Error loading students:", error);

        document.getElementById("studentTableBody").innerHTML = `
            <tr><td colspan="4" class="loading">Unable to load students.</td></tr>
        `;
    }
}


function displayStudents(students) {

    const tbody = document.getElementById("studentTableBody");

    tbody.innerHTML = "";

    if (students.length === 0) {

        tbody.innerHTML = `
            <tr><td colspan="4" class="loading">No students found.</td></tr>
        `;

        return;
    }

    students.forEach(student => {

        tbody.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.course}</td>
                <td>
                    <button class="btn-edit" onclick="editStudent('${student._id}')">Edit</button>
                    <button class="btn-danger" onclick="deleteStudent('${student._id}')">Delete</button>
                </td>
            </tr>
        `;

    });

}


const studentForm = document.getElementById("studentForm");
const studentIdField = document.getElementById("studentId");
const studentNameField = document.getElementById("studentName");
const studentAgeField = document.getElementById("studentAge");
const studentCourseField = document.getElementById("studentCourse");
const studentFormTitle = document.getElementById("studentFormTitle");
const studentSubmitBtn = document.getElementById("studentSubmitBtn");
const studentCancelBtn = document.getElementById("studentCancelBtn");


studentForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const payload = {
        name: studentNameField.value,
        age: Number(studentAgeField.value),
        course: studentCourseField.value
    };

    const id = studentIdField.value;

    try {

        let response;

        if (id) {

            response = await fetch(`/students/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

        } else {

            response = await fetch("/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

        }

        if (!response.ok) {

            const err = await response.json();
            alert(err.message || "Something went wrong.");
            return;
        }

        resetStudentForm();

        loadStudents();

    } catch (error) {

        console.log("Error saving student:", error);
        alert("Unable to save student.");
    }

});


function editStudent(id) {

    const student = allStudents.find(s => s._id === id);

    if (!student) return;

    studentIdField.value = student._id;
    studentNameField.value = student.name;
    studentAgeField.value = student.age;
    studentCourseField.value = student.course;

    studentFormTitle.innerText = "Edit Student";
    studentSubmitBtn.innerText = "Update Student";
    studentCancelBtn.style.display = "inline-block";

    document.getElementById("students").scrollIntoView({ behavior: "smooth" });

}


async function deleteStudent(id) {

    if (!confirm("Delete this student?")) return;

    try {

        const response = await fetch(`/students/${id}`, { method: "DELETE" });

        if (!response.ok) {

            const err = await response.json();
            alert(err.message || "Unable to delete student.");
            return;
        }

        loadStudents();

    } catch (error) {

        console.log("Error deleting student:", error);
        alert("Unable to delete student.");
    }

}


function resetStudentForm() {

    studentForm.reset();
    studentIdField.value = "";
    studentFormTitle.innerText = "Add Student";
    studentSubmitBtn.innerText = "Add Student";
    studentCancelBtn.style.display = "none";

}


studentCancelBtn.addEventListener("click", resetStudentForm);


// ==========================================
// COURSES - LOAD & DISPLAY
// ==========================================

let allCourses = [];

async function loadCourses() {

    try {

        const response = await fetch("/courses");

        allCourses = await response.json();

        displayCourses(allCourses);

        updateStatistics(allCourses);

    } catch (error) {

        console.log("Error loading courses:", error);

        document.getElementById("courseContainer").innerHTML = `
            <div class="loading">
                Unable to load courses.
            </div>
        `;
    }
}


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

                <div class="course-card-actions">
                    <button class="btn-edit" onclick="editCourse('${course._id}')">Edit</button>
                    <button class="btn-danger" onclick="deleteCourse('${course._id}')">Delete</button>
                </div>

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
// COURSES CRUD - FORM
// ==========================================

const courseFormCard = document.getElementById("courseFormCard");
const showCourseFormBtn = document.getElementById("showCourseFormBtn");
const courseForm = document.getElementById("courseForm");
const courseIdField = document.getElementById("courseId");
const courseNameField = document.getElementById("courseName");
const courseDurationField = document.getElementById("courseDuration");
const semesterList = document.getElementById("semesterList");
const addSemesterBtn = document.getElementById("addSemesterBtn");
const courseFormTitle = document.getElementById("courseFormTitle");
const courseSubmitBtn = document.getElementById("courseSubmitBtn");
const courseCancelBtn = document.getElementById("courseCancelBtn");


showCourseFormBtn.addEventListener("click", function () {

    const isHidden = courseFormCard.style.display === "none";

    if (isHidden) {

        resetCourseForm();
        courseFormCard.style.display = "block";
        courseFormCard.scrollIntoView({ behavior: "smooth" });

    } else {

        courseFormCard.style.display = "none";
    }

});


courseCancelBtn.addEventListener("click", function () {

    courseFormCard.style.display = "none";
    resetCourseForm();

});


function addSemesterBlock(semesterName = "", subjects = [""]) {

    const index = semesterList.children.length;

    const block = document.createElement("div");
    block.className = "semester-block";
    block.dataset.index = index;

    block.innerHTML = `
        <div class="semester-block-header">
            <input type="text" class="semesterNameInput" placeholder="Semester Name (e.g. Semester 1)" value="${semesterName}" required>
            <button type="button" class="small-btn removeSemesterBtn">Remove</button>
        </div>
        <div class="subjectsContainer"></div>
        <button type="button" class="small-btn addSubjectBtn">+ Add Subject</button>
    `;

    semesterList.appendChild(block);

    const subjectsContainer = block.querySelector(".subjectsContainer");

    subjects.forEach(subject => addSubjectRow(subjectsContainer, subject));

    block.querySelector(".removeSemesterBtn").addEventListener("click", function () {
        block.remove();
    });

    block.querySelector(".addSubjectBtn").addEventListener("click", function () {
        addSubjectRow(subjectsContainer, "");
    });

}


function addSubjectRow(container, value = "") {

    const row = document.createElement("div");
    row.className = "subject-row";

    row.innerHTML = `
        <input type="text" class="subjectInput" placeholder="Subject name" value="${value}" required>
        <button type="button" class="small-btn removeSubjectBtn">✕</button>
    `;

    container.appendChild(row);

    row.querySelector(".removeSubjectBtn").addEventListener("click", function () {
        row.remove();
    });

}


addSemesterBtn.addEventListener("click", function () {
    addSemesterBlock();
});


function resetCourseForm() {

    courseForm.reset();
    courseIdField.value = "";
    semesterList.innerHTML = "";
    addSemesterBlock();

    courseFormTitle.innerText = "Add Course";
    courseSubmitBtn.innerText = "Add Course";

}


function collectSemestersFromForm() {

    const semesters = [];

    document.querySelectorAll(".semester-block").forEach(block => {

        const semesterName = block.querySelector(".semesterNameInput").value.trim();

        const subjects = Array.from(block.querySelectorAll(".subjectInput"))
            .map(input => input.value.trim())
            .filter(value => value.length > 0);

        if (semesterName) {

            semesters.push({ semesterName, subjects });
        }

    });

    return semesters;

}


courseForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const payload = {
        courseName: courseNameField.value,
        duration: courseDurationField.value,
        semesters: collectSemestersFromForm()
    };

    const id = courseIdField.value;

    try {

        let response;

        if (id) {

            response = await fetch(`/courses/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

        } else {

            response = await fetch("/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

        }

        if (!response.ok) {

            const err = await response.json();
            alert(err.message || "Something went wrong.");
            return;
        }

        courseFormCard.style.display = "none";
        resetCourseForm();

        loadCourses();

    } catch (error) {

        console.log("Error saving course:", error);
        alert("Unable to save course.");
    }

});


function editCourse(id) {

    const course = allCourses.find(c => c._id === id);

    if (!course) return;

    courseIdField.value = course._id;
    courseNameField.value = course.courseName;
    courseDurationField.value = course.duration;

    semesterList.innerHTML = "";

    if (course.semesters && course.semesters.length > 0) {

        course.semesters.forEach(semester => {
            addSemesterBlock(semester.semesterName, semester.subjects);
        });

    } else {

        addSemesterBlock();
    }

    courseFormTitle.innerText = "Edit Course";
    courseSubmitBtn.innerText = "Update Course";

    courseFormCard.style.display = "block";
    courseFormCard.scrollIntoView({ behavior: "smooth" });

}


async function deleteCourse(id) {

    if (!confirm("Delete this course?")) return;

    try {

        const response = await fetch(`/courses/${id}`, { method: "DELETE" });

        if (!response.ok) {

            const err = await response.json();
            alert(err.message || "Unable to delete course.");
            return;
        }

        loadCourses();

    } catch (error) {

        console.log("Error deleting course:", error);
        alert("Unable to delete course.");
    }

}


// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

loadStudents();
loadCourses();
