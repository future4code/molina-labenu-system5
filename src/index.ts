import app from './app'
import changeStudent from "./endpoints/changeStudent"
import changeTeacher from "./endpoints/changeTeacher"
import createClass from "./endpoints/createClass"
import createStudent from "./endpoints/createStudent"
import getStudentById from "./endpoints/getStudentById"
import createTeacher from "./endpoints/createTeacher"

app.post("/turma", createClass)

app.post("/estudante", createStudent)

app.put("/estudante", changeStudent)

app.get("/estudante/:id", getStudentById)

app.post("/docente", createTeacher)

app.put("/docente", changeTeacher)
