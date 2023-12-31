-- Crée la base de données si elle n'existe pas déjà et l'utilise pour la suite des opérations
CREATE DATABASE IF NOT EXISTS TaskManagerLow;
USE TaskManagerLow;

-- Table des Projets stockant les informations de base de chaque projet
CREATE TABLE IF NOT EXISTS Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT
);

-- Table des Utilisateurs contenant les informations d'identification et les contacts
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(255),
    user_picture BLOB,
    email VARCHAR(255) NOT NULL UNIQUE, -- Assure que les e-mails sont uniques
    password VARCHAR(255) NOT NULL -- Devrait être stocké comme un hash, pas en clair
);

-- Table des Statuts pour définir les différents états que peut prendre une tâche
CREATE TABLE IF NOT EXISTS Statuses (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(255) NOT NULL UNIQUE -- Assure que les noms de statut sont uniques
);

-- Table des Lists représentant les listes de tâches
CREATE TABLE IF NOT EXISTS Lists (
    list_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    list_name VARCHAR(255) NOT NULL,
    status_id INT, -- Associating a status with a list
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES Statuses(status_id) ON DELETE SET NULL
);

-- Table des Tâches représentant les éléments de travail à accomplir
CREATE TABLE IF NOT EXISTS Tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    list_id INT, -- Column for associating a task with a list
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    status_id INT NULL, -- Made nullable to allow tasks without a status
    complexity INT,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE SET NULL,
    FOREIGN KEY (list_id) REFERENCES Lists(list_id) ON DELETE SET NULL,
    FOREIGN KEY (status_id) REFERENCES Statuses(status_id) ON DELETE SET NULL
);

-- Création de la table des Tags
CREATE TABLE IF NOT EXISTS Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(255) NOT NULL UNIQUE,
    tag_color VARCHAR(7) -- Format HEX de couleur, ex: #FFFFFF
);

-- Table de jointure TaskTags pour associer des tags aux tâches
CREATE TABLE IF NOT EXISTS TaskTags (
    task_id INT,
    tag_id INT,
    PRIMARY KEY (task_id, tag_id),
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE
);

-- Table des Assignations de Tâches pour lier les utilisateurs aux tâches qui leur sont assignées
CREATE TABLE IF NOT EXISTS TaskAssignments (
    task_id INT,
    user_id INT,
    PRIMARY KEY (task_id, user_id), -- Clé primaire composite pour permettre plusieurs assignations
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Table des Commentaires où les utilisateurs peuvent laisser des remarques sur les tâches
CREATE TABLE IF NOT EXISTS Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Table des Favoris pour que les utilisateurs puissent marquer des projets comme favoris
CREATE TABLE IF NOT EXISTS Favorites (
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    PRIMARY KEY (user_id, project_id), -- Clé primaire composite pour représenter l'unique favori par projet par utilisateur
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE
);

-- Table des projets des utilisateurs qui ne sont pas favoris
CREATE TABLE IF NOT EXISTS UserProjects (
    user_id INT,
    project_id INT,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    notification_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    metadatas TEXT,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
