CREATE TABLE Projects (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT
);

CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Tasks (
    task_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    status_id INT,
    complexity INT,
    creation_date DATE NOT NULL,
    due_date DATE,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id),
    FOREIGN KEY (status_id) REFERENCES Statuses(status_id)
);

CREATE TABLE Statuses (
    status_id INT PRIMARY KEY AUTO_INCREMENT,
    status_name VARCHAR(255) NOT NULL
);

CREATE TABLE TaskAssignments (
    task_id INT,
    user_id INT,
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
