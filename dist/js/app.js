(() => {
    "use strict";
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
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
    const script_textarea = document.querySelector(".comments__inputs textarea");
    function getMinHeight() {
        return window.innerWidth <= 768 ? 28 : 39;
    }
    function autoResize() {
        const minHeight = getMinHeight();
        script_textarea.style.height = "1px";
        const scrollHeight = script_textarea.scrollHeight;
        let newHeight;
        if (!script_textarea.value.trim()) newHeight = minHeight; else if (scrollHeight <= minHeight) newHeight = minHeight; else newHeight = Math.min(scrollHeight, 170);
        script_textarea.style.height = `${newHeight}px`;
        script_textarea.style.overflowY = scrollHeight > 170 ? "auto" : "hidden";
    }
    function initTextarea() {
        const minHeight = getMinHeight();
        script_textarea.style.height = `${minHeight}px`;
        script_textarea.style.overflowY = "hidden";
    }
    initTextarea();
    script_textarea.addEventListener("input", autoResize);
    window.addEventListener("resize", (function() {
        if (!script_textarea.value.trim()) initTextarea(); else autoResize();
    }));
    const commentButtons = document.querySelectorAll(".comments__button");
    commentButtons.forEach((button => {
        button.addEventListener("click", (function() {
            const commentsItems = this.closest(".comments__item").parentElement;
            commentsItems.classList.toggle("_active");
        }));
    }));
    document.addEventListener("click", (function(e) {
        if (e.target.closest(".comments__like")) {
            const likeBlock = e.target.closest(".comments__like");
            likeBlock.querySelector(".like-active");
            const counter = likeBlock.querySelector("span");
            if (likeBlock.classList.contains("active")) {
                likeBlock.classList.remove("active");
                counter.textContent = parseInt(counter.textContent) - 1;
            } else {
                likeBlock.classList.add("active");
                counter.textContent = parseInt(counter.textContent) + 1;
                const parentComment = likeBlock.closest(".comments__item, .comments__subitem");
                if (parentComment) {
                    const dislikeBlock = parentComment.querySelector(".comments__nolike");
                    if (dislikeBlock.classList.contains("active")) {
                        dislikeBlock.classList.remove("active");
                        const dislikeCounter = dislikeBlock.querySelector("span");
                        dislikeCounter.textContent = parseInt(dislikeCounter.textContent) - 1;
                    }
                }
            }
        }
        if (e.target.closest(".comments__nolike")) {
            const dislikeBlock = e.target.closest(".comments__nolike");
            dislikeBlock.querySelector(".nolike-active");
            const counter = dislikeBlock.querySelector("span");
            if (dislikeBlock.classList.contains("active")) {
                dislikeBlock.classList.remove("active");
                counter.textContent = parseInt(counter.textContent) - 1;
            } else {
                dislikeBlock.classList.add("active");
                counter.textContent = parseInt(counter.textContent) + 1;
                const parentComment = dislikeBlock.closest(".comments__item, .comments__subitem");
                if (parentComment) {
                    const likeBlock = parentComment.querySelector(".comments__like");
                    if (likeBlock.classList.contains("active")) {
                        likeBlock.classList.remove("active");
                        const likeCounter = likeBlock.querySelector("span");
                        likeCounter.textContent = parseInt(likeCounter.textContent) - 1;
                    }
                }
            }
        }
    }));
    window["FLS"] = false;
})();