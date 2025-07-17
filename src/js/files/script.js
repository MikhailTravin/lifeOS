let input = document.querySelector('input[type="file"]');
if (input) {
    const preview = document.querySelector(".comments__previews");
    const fileList = [];
    input.addEventListener("change", onChange);
    function onChange() {
        const file = input.files[0];
        if (file) {
            const item = document.createElement("div");
            item.classList.add("comments__preview");
            const fileName = document.createElement("span");
            fileName.textContent = file.name;
            fileName.classList.add("file-name");
            const remove = document.createElement("div");
            remove.classList.add("comments__preview-close");
            const fileItem = {
                name: file.name,
                modified: file.lastModified,
                size: file.size
            };
            fileList.push(fileItem);
            remove.addEventListener("click", (() => {
                fileList.splice(fileList.indexOf(fileItem), 1);
                item.classList.add("removing");
                setTimeout((() => item.remove()), 100);
            }));
            item.appendChild(remove);
            item.appendChild(fileName);
            preview.appendChild(item);
        }
        input.value = "";
        const newInput = input.cloneNode(true);
        input.replaceWith(newInput);
        input = newInput;
        input.addEventListener("change", onChange);
    }
}

//========================================================================================================================================================

const textarea = document.querySelector('.comments__inputs textarea');

function getMinHeight() {
    // Возвращаем минимальную высоту в зависимости от ширины экрана
    return window.innerWidth <= 768 ? 28 : 39;
}

function autoResize() {
    const minHeight = getMinHeight();

    // 1. Сбрасываем высоту до 1px для корректного измерения
    textarea.style.height = '1px';
    const scrollHeight = textarea.scrollHeight;

    // 2. Вычисляем новую высоту
    let newHeight;
    if (!textarea.value.trim()) {
        newHeight = minHeight; // Пустое поле → минимальная высота
    } else if (scrollHeight <= minHeight) {
        newHeight = minHeight; // Одна строка → минимальная высота
    } else {
        newHeight = Math.min(scrollHeight, 170); // Много строк → ограничено 170px
    }

    // 3. Применяем новую высоту
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = scrollHeight > 170 ? 'auto' : 'hidden';
}

// Инициализация
function initTextarea() {
    const minHeight = getMinHeight();
    textarea.style.height = `${minHeight}px`;
    textarea.style.overflowY = 'hidden';
}

// Обработчики событий
initTextarea();
textarea.addEventListener('input', autoResize);

// Обработчик изменения размера окна
window.addEventListener('resize', function () {
    // Переинициализируем только если textarea пустая
    if (!textarea.value.trim()) {
        initTextarea();
    } else {
        autoResize();
    }
});

//========================================================================================================================================================

const commentButtons = document.querySelectorAll('.comments__button');

commentButtons.forEach(button => {
    button.addEventListener('click', function () {
        const commentsItems = this.closest('.comments__item').parentElement;
        commentsItems.classList.toggle('_active');
    });
});

//========================================================================================================================================================

// Обработчик для лайков
document.addEventListener('click', function (e) {
    // Лайк
    if (e.target.closest('.comments__like')) {
        const likeBlock = e.target.closest('.comments__like');
        const activeLike = likeBlock.querySelector('.like-active');
        const counter = likeBlock.querySelector('span');

        // Если уже активен - убираем активность
        if (likeBlock.classList.contains('active')) {
            likeBlock.classList.remove('active');
            counter.textContent = parseInt(counter.textContent) - 1;
        }
        // Если не активен - добавляем активность
        else {
            likeBlock.classList.add('active');
            counter.textContent = parseInt(counter.textContent) + 1;

            // Убираем активность у дизлайка в этом же блоке комментария
            const parentComment = likeBlock.closest('.comments__item, .comments__subitem');
            if (parentComment) {
                const dislikeBlock = parentComment.querySelector('.comments__nolike');
                if (dislikeBlock.classList.contains('active')) {
                    dislikeBlock.classList.remove('active');
                    const dislikeCounter = dislikeBlock.querySelector('span');
                    dislikeCounter.textContent = parseInt(dislikeCounter.textContent) - 1;
                }
            }
        }
    }

    // Дизлайк
    if (e.target.closest('.comments__nolike')) {
        const dislikeBlock = e.target.closest('.comments__nolike');
        const activeDislike = dislikeBlock.querySelector('.nolike-active');
        const counter = dislikeBlock.querySelector('span');

        // Если уже активен - убираем активность
        if (dislikeBlock.classList.contains('active')) {
            dislikeBlock.classList.remove('active');
            counter.textContent = parseInt(counter.textContent) - 1;
        }
        // Если не активен - добавляем активность
        else {
            dislikeBlock.classList.add('active');
            counter.textContent = parseInt(counter.textContent) + 1;

            // Убираем активность у лайка в этом же блоке комментария
            const parentComment = dislikeBlock.closest('.comments__item, .comments__subitem');
            if (parentComment) {
                const likeBlock = parentComment.querySelector('.comments__like');
                if (likeBlock.classList.contains('active')) {
                    likeBlock.classList.remove('active');
                    const likeCounter = likeBlock.querySelector('span');
                    likeCounter.textContent = parseInt(likeCounter.textContent) - 1;
                }
            }
        }
    }
});