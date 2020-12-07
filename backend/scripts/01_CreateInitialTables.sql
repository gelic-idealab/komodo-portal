CREATE TABLE `KP_Role` (
    `role_id`  tinyint NOT NULL AUTO_INCREMENT,
    `role_name` varchar(20),
    PRIMARY KEY (role_id)
);

CREATE TABLE `KP_User` (
    `user_id`  int NOT NULL AUTO_INCREMENT,
    `email` varchar(50) NOT NULL,
    `password`  varchar(50) NOT NULL,
    `first_name` varchar(20) NOT NULL,
    `last_name` varchar(20) NOT NULL,
    `role_id`  tinyint NOT NULL,
    `last_login_at` timestamp,
    UNIQUE (user_id,email),
    PRIMARY KEY (user_id),
    FOREIGN KEY (role_id) REFERENCES KP_Role(role_id)
);

CREATE TABLE `KP_User_Log` (
    `log_id`  int NOT NULL,
    `user_id` int NOT NULL,
    `action`  varchar(20) NOT NULL,
    `action_time` timestamp NOT NULL,
    UNIQUE (log_id),
    PRIMARY KEY (log_id),
    FOREIGN KEY (user_id) REFERENCES KP_User(user_id)
);

CREATE TABLE `KP_Semester` (
    `semester_id`  tinyint NOT NULL AUTO_INCREMENT,
    `year` year NOT NULL,
    `period`  varchar(10) NOT NULL,
    UNIQUE (semester_id),
    PRIMARY KEY (semester_id)
);

CREATE TABLE `KP_Course` (
    `course_id`  int NOT NULL AUTO_INCREMENT,
    `CRN` int,
    `course_no` varchar(10) NOT NULL,
    `course_name`  varchar(50) NOT NULL,
    `credit_hours` tinyint,
    `department` varchar(50),
    `instructor_id` int NOT NULL,
    `description` varchar(255),
    `semester_id` tinyint NOT NULL,
    UNIQUE (course_id),
    PRIMARY KEY (course_id),
    FOREIGN KEY (instructor_id) REFERENCES KP_User(user_id),
    FOREIGN KEY (semester_id) REFERENCES KP_Semester(semester_id)
);

CREATE TABLE `KP_Registration` (
    `student_id`  int NOT NULL,
    `course_id` int NOT NULL,
    FOREIGN KEY (student_id) REFERENCES KP_User(user_id),
    FOREIGN KEY (course_id) REFERENCES KP_Course(course_id)
);

CREATE TABLE `KP_Lab` (
    `session_id`  int NOT NULL AUTO_INCREMENT,
    `session_name` varchar(100) NOT NULL,
    `course_id`  int NOT NULL,
    `description`  varchar(255) NOT NULL,
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `end_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `build` varchar(255) NOT NULL,
    UNIQUE (session_id),
    PRIMARY KEY (session_id),
    FOREIGN KEY (course_id) REFERENCES KP_Course(course_id)
);

CREATE TABLE `KP_Session_Type` (
    `type_id` tinyint NOT NULL AUTO_INCREMENT,
    `type_name` varchar(20) NOT NULL,
    UNIQUE (type_id),
    PRIMARY KEY (type_id)
);


CREATE TABLE `KP_Asset` (
    `asset_id`  int NOT NULL AUTO_INCREMENT,
    `uuid` varchar(100) NOT NULL,
    `asset_name` varchar(100) NOT NULL,
    `description`  varchar(255) NOT NULL,
    `creator_id` int,
    `is_public` boolean,
    `is_whole_object` boolean,
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `path` varchar(255) NOT NULL,
    `scale` float,
    `config` json,
    UNIQUE (asset_id),
    PRIMARY KEY (asset_id),
    FOREIGN KEY (creator_id) REFERENCES KP_User(user_id)
);

CREATE TABLE `KP_Session_Asset`(
    `session_id` int NOT NULL,
    `asset_id` int NOT NULL,
    `session_type` tinyint NOT NULL,
    FOREIGN KEY(session_id) REFERENCES KP_Lab(session_id),
    FOREIGN KEY(asset_id) REFERENCES KP_Asset(asset_id),
    FOREIGN KEY(session_type) REFERENCES KP_Session_Type(type_id)
);

CREATE TABLE `KP_Interactions`(
    `capture_id` varchar(255) NOT NULL,
    `capture_start` bigint NOT NULL,
    `session_id` int NOT NULL,
    `client_id` int NOT NULL,
    `source_id` int NOT NULL,
    `target_id` int NOT NULL,
    `type` varchar(255) NOT NULL,
    `count` int not NULL
);
