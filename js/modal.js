"use strict";

$(document).ready(function () {
    var overlay = $("#overlay");
    var open_modal = $(".open_modal");
    var close_modal = $('.close_modal, #overlay');
    var modal = $('.modal_window');

    // Переменные для хранения выбранных позиций
    var selectedPerson, selectedPosition, selectedOrg, selectedSub;

    // Новые выбранные позиции
    var newSelectedPerson, newSelectedOrg, newSelectedPosition, newSelectedSub;

    // Массивы, в которых хранится информация из json файлов
    var persons, positions, orgs, subs;

    // Запросы для получения данных из json файлов
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'data/persons.json',
        success: function (response) {
            // Получив данные сразу же их сортируем
            persons = response.sort(compareByFullName);
        }
    });

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'data/positions.json',
        success: function (response) {
            positions = response.sort(compareByName);
        }
    });

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'data/orgs.json',
        success: function (response) {
            orgs = response.sort(compareByName);
        }
    });

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'data/subs.json',
        success: function (response) {
            subs = response.sort(compareByName);
        }
    });

    open_modal.on('click', function (event) {
        event.preventDefault();

        // Параметры модального окна, которое нам нужно открыть
        var modal_window = {
            href: $(this).attr('href'),
        };

        switch (modal_window.href) {
            case 'persons':
                modal_window.header = 'Выбор сотрудника';
                modal_window.thead = '<th>Фамилия</th><th>Имя</th><th>Отчество</th><th>Дата рождения</th>';
                // Функция для вывода информации в таблицу
                modal_window.printData = function () {
                    for (let i = 0; i < persons.length; i++) {
                        let row = `<tr id="${persons[i].id}"><th>${persons[i].lastname}</th><th>${persons[i].middlename}</th><th>${persons[i].firstname}</th><th>${persons[i].birthday}</th></tr>`;
                        $(".modal_table").append(row);
                    }
                    // Если у нас уже был выбран сотрудник, то выделяем его в списке
                    if (selectedPerson !== undefined) {
                        $('tr[id=' + selectedPerson.id + ']').attr('class', 'selected');
                    }
                };
                break;
            case 'orgs':
                modal_window.header = 'Выбор организации';
                modal_window.thead = '<th>Название</th><th>Страна</th>';
                modal_window.printData = function () {
                    for (let i = 0; i < orgs.length; i++) {
                        let row = `<tr id="${orgs[i].id}"><th>${orgs[i].name}</th><th>${orgs[i].country}</th></tr>`;
                        $(".modal_table").append(row);
                    }
                    if (selectedOrg !== undefined) {
                        $('tr[id=' + selectedOrg.id + ']').attr('class', 'selected');
                    }
                };
                break;
            case 'positions':
                modal_window.header = 'Выбор должности';
                modal_window.thead = '<th>Название</th><th>Мин. возраст</th><th>Макс. возраст</th>';
                modal_window.printData = function () {
                    for (let i = 0; i < positions.length; i++) {
                        let row = `<tr id="${positions[i].id}"><th>${positions[i].name}</th><th>${positions[i].min_age}</th><th>${positions[i].max_age}</th></tr>`;
                        $(".modal_table").append(row);
                    }
                    if (selectedPosition !== undefined) {
                        $('tr[id=' + selectedPosition.id + ']').attr('class', 'selected');
                    }
                };
                break;
            case 'subs':
                modal_window.header = 'Выбор подразделения';
                modal_window.thead = '<th>Название</th><th>Подразделение</th>';
                modal_window.printData = function () {
                    for (let i = 0; i < subs.length; i++) {
                        // Находим организацию по id
                        let org = findByID(orgs, subs[i].org_id);
                        // Если у нас нет фильтра по организациям, то выводим все подразделения
                        if (selectedOrg === undefined) {
                            let row = `<tr id="${subs[i].id}"><th>${subs[i].name}</th><th>${org.name}</th></tr>`;
                            $(".modal_table").append(row);
                        }
                        // Иначе выводим только те подразделения, которые относятся к выбранной организации
                        else {
                            if (selectedOrg.id === subs[i].org_id) {
                                let row = `<tr id="${subs[i].id}"><th>${subs[i].name}</th><th>${org.name}</th></tr>`;
                                $(".modal_table").append(row);
                            }
                        }
                    }
                    if (selectedSub !== undefined) {
                        $('tr[id=' + selectedSub.id + ']').attr('class', 'selected');
                    }
                };
                break;
        }
        // Выводим оверлей
        overlay.fadeIn(400, function () {
            // Выводим модальное окно
            $(".modal_window").css('display', 'block').animate({opacity: 1, top: '50%'}, 200);
            $("#modal_header").text(modal_window.header);
            $(".modal_table thead").append(modal_window.thead);
            $(".modal_table").attr('id', modal_window.href);
            modal_window.printData();
        })
    });

    // Действия при нажатии на строчку таблицы
    $(".modal_table").on('click', 'tr', function () {
        // Удаляем старое выделение и выделяем новую строчку
        $(".modal_table tr").removeAttr('class');
        $(this).attr('class', 'selected');

        // Получаем id выделенного объекта и сам объект
        let selectedID = $(this).attr('id');
        switch ($(".modal_table").attr('id')) {
            case 'persons':
                newSelectedPerson = findByID(persons, selectedID);
                break;
            case 'positions':
                newSelectedPosition = findByID(positions, selectedID);
                break;
            case 'orgs':
                newSelectedOrg = findByID(orgs, selectedID);
                break;
            case 'subs':
                newSelectedSub = findByID(subs, selectedID);
                break;
        }
    });

    // При нажатии на кнопку ОК заменяем старый выбранный объект на новый
    $('.success').on('click', function () {
        switch ($(".modal_table").attr('id')) {
            case 'persons':
                if (canSelectPerson(selectedPosition, newSelectedPerson)) {
                    selectedPerson = newSelectedPerson;
                }
                break;
            case 'positions':
                if (canSelectPosition(selectedPerson, newSelectedPosition)) {
                    selectedPosition = newSelectedPosition;
                }
                break;
            case 'orgs':
                selectedOrg = newSelectedOrg;
                break;
            case 'subs':
                selectedSub = newSelectedSub;
                break;
        }
    });

    // Закрытие модального окна
    close_modal.click(function () {
        switch ($(".modal_table").attr('id')) {
            case 'persons':
                // Если мы что-то выбрали, то выводим в соответствующее поле
                if (selectedPerson !== undefined) {
                    let fullname = selectedPerson.lastname + " " + selectedPerson.middlename + " " + selectedPerson.firstname;
                    $("#choice_persons").text(fullname);
                    $("#del_person").css('display', 'table-cell');
                }
                break;
            case 'positions':
                if (selectedPosition !== undefined) {
                    $("#choice_positions").text(selectedPosition.name);
                    $("#del_position").css('display', 'table-cell');
                }
                break;
            case 'orgs':
                if (selectedOrg !== undefined) {
                    $("#choice_orgs").text(selectedOrg.name);
                    $("#del_org").css('display', 'table-cell');
                }
                break;
            case 'subs':
                if (selectedSub !== undefined) {
                    $("#choice_subs").text(selectedSub.name);
                    $("#del_sub").css('display', 'table-cell');
                }
                break;
        }

        // Удаляем таблицу при закрытии
        $(".modal_table thead th").remove();
        $(".modal_table tr").remove();

        // Закрываем модальное окно
        modal.animate({opacity: 0, top: '45%'}, 200,
            function () {
                $(this).css('display', 'none');
                overlay.fadeOut(400);
            })
    });

    // Действия при удалении
    $(".delete").click(function () {
        switch ($(this).attr('id')) {
            case 'del_person':
                selectedPerson = undefined;
                $('#choice_persons').text('');
                $('#del_person').css('display', 'none');
                break;
            case 'del_position':
                selectedPosition = undefined;
                $('#choice_positions').text('');
                $('#del_position').css('display', 'none');
                break;
            case 'del_org':
                selectedOrg = undefined;
                $('#choice_orgs').text('');
                $('#del_org').css('display', 'none');
                break;
            case 'del_sub':
                selectedSub = undefined;
                $('#choice_subs').text('');
                $('#del_sub').css('display', 'none');
                break;
        }
    });
});