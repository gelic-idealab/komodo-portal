const getAllInteractions = `SELECT * FROM KP_Interactions WHERE capture_id IS NOT NULL`;

const getRawPosCapture = `SELECT * FROM positions p WHERE capture_id = ?`;
const getRawIntCapture = `SELECT * FROM interactions i WHERE capture_id = ?`;

const getRawPosLab = `SELECT * FROM positions WHERE session_id = ?`;
const getRawIntLab = `SELECT * FROM interactions WHERE session_id = ?`;

const getRawPosCourse = `SELECT * FROM positions p JOIN KP_Lab l ON p.session_id = l.session_id WHERE l.course_id = ?`;
const getRawIntCourse = `SELECT * FROM interactions i JOIN KP_Lab l ON i.session_id = l.session_id WHERE l.course_id = ?;`;

module.exports = { 
    getAllInteractions, 
    getRawPosCapture, 
    getRawIntCapture,
    getRawPosLab,
    getRawIntLab,
    getRawPosCourse,
    getRawIntCourse
}