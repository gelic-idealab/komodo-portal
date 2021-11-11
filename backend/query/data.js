const getAllInteractions = `SELECT * FROM KP_Interactions WHERE capture_id IS NOT NULL`;

const getRawPosCapture = `SELECT * FROM positions p WHERE capture_id = ?`;
const getRawIntCapture = `SELECT * FROM interactions i WHERE capture_id = ?`;

const getRawPosLab = `SELECT * FROM positions WHERE session_id = ?`;
const getRawIntLab = `SELECT * FROM interactions WHERE session_id = ?`;

const getRawPosCourse = `SELECT * FROM positions p JOIN KP_Lab l ON p.session_id = l.session_id WHERE l.course_id = ?`;
const getRawIntCourse = `SELECT * FROM interactions i JOIN KP_Lab l ON i.session_id = l.session_id WHERE l.course_id = ?;`;

const getAllDataRequest = `
SELECT r.*, s.course_name, l.session_name FROM data_requests r 
JOIN captures c ON c.capture_id = r.processed_capture_id 
JOIN KP_Lab l ON l.session_id = c.session_id
JOIN KP_Course s ON s.course_id = l.course_id
WHERE who_requested = ?`

const insertRequest = `
INSERT INTO data_requests
    (processed_capture_id, who_requested, aggregation_function, is_it_fulfilled, message)
VALUES
    (?,?,?,?,?);`

const getDownloadLink = ` 
SELECT url,file_location FROM data_requests
    WHERE request_id = ?;
`

module.exports = { 
    getAllInteractions, 
    getRawPosCapture, 
    getRawIntCapture,
    getRawPosLab,
    getRawIntLab,
    getRawPosCourse,
    getRawIntCourse,
    getAllDataRequest,
    insertRequest,
    getDownloadLink
}