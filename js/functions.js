"use strict";
// Модуль со вспомогательными функциями

// Сравнение объектов по имени
function compareByName(obj1, obj2) {
    if (obj1.name < obj2.name)
        return -1;
    else {
        if (obj1.name > obj2.name)
            return 1;
        else
            return 0;
    }
}
// Сравнение объектов по ФИО
function compareByFullName(obj1, obj2) {
    let name1 = obj1.lastname + obj1.middlename + obj1.firstname;
    let name2 = obj2.lastname + obj2.middlename + obj2.firstname;
    if (name1 < name2)
        return -1;
    else {
        if (name1 > name2)
            return 1;
        else
            return 0;
    }
}

// Поиск элемента по id
function findByID(data, id) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            return data[i];
        }
    }
}

// Функция для рассчета возраста. На входе строка в формате "ДД.ММ.ГГГГ"
function calculateAge(birthday) {
    let bd = birthday.split('.');
    let date = new Date(parseInt(bd[2], 10), parseInt(bd[1], 10) - 1, parseInt(bd[0], 10));
    let now = new Date();
    let age;
    if (date.getMonth() < now.getMonth()) {
        age = now.getFullYear() - date.getFullYear();
    }
    else {
        if (date.getMonth() === now.getMonth() && date.getDay() <= now.getDay()) {
            age = now.getFullYear() - date.getFullYear();
        }
        else {
            age = now.getFullYear() - date.getFullYear() - 1;
        }
    }
    return age;
}

// Функция для проверки возможности выбора сотрудника
function canSelectPerson(position, newPerson) {
    // Если нет фильтра по должности, то можем выбрать текущего сотрудника
    if (position === undefined) {
        return true;
    }
    else {
        let age = calculateAge(newPerson.birthday);
        // Если сотрудник подходит по возрасту
        if (age >= position.min_age && age <= position.max_age) {
            return true;
        }
        else {
            // Если сотрудник не подходит по возрасту, то спрашиваем подтверждение
            let isConfirmed = confirm('Выбранный сотрудник не подходит по возрасту. ' +
                'Вы уверены, что хотите выбрать этого сотрудника?');
            return isConfirmed
        }
    }
}

// Функция для проверки возможности выбора должности
function canSelectPosition(person, newPosition) {
    // Если у нас нет фильтра по сотрудникам, то можем выбрать должность
    if (person === undefined) {
        return true;
    }
    else {
        let age = calculateAge(person.birthday);
        // Если должность подходит по возрасту
        if (age >= newPosition.min_age && age <= newPosition.max_age) {
            return true;
        }
        else {
            // Если должность не подходит по возрасту, то спрашиваешь подтверждение
            let isConfirmed = confirm('Выбранная должность не подходит по возрасту сотруднику. ' +
                'Вы уверены, что хотите выбрать эту должность?');
            return isConfirmed;
        }
    }
}