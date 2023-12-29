document.addEventListener("DOMContentLoaded", function () {
    const editor = document.getElementById("editor");
    const textBoxContainer = document.getElementById("textBoxContainer");
    let zIndexCounter = 1;
    let stateStack = [];
    let currentStateIndex = -1;
    let selectedTextBox = null;

    function addTextBox() {
        const container = document.createElement("div");
        container.className = "text-box-container";
        container.style.display = "flex";
        container.style.alignItems = "center";

        const textBox = document.createElement("div");
        textBox.contentEditable = true;
        textBox.style.position = "absolute";
        textBox.style.left = "50px";
        textBox.style.top = "50px";
        textBox.style.zIndex = zIndexCounter++;
        textBox.className = "text-box" + zIndexCounter;
        textBox.onclick = () => {
            // console.log("click" + textBox.className)
            updateState(textBox.className);
        };

        // Add event listeners for moving and editing the text box
        textBox.addEventListener("mousedown", startDrag);
        textBox.addEventListener("input", updateTextProperties);

        editor.appendChild(textBox);

        // Create an input box below the "Make TextBox" button
        const inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.className = "form-control";
        inputBox.placeholder = "Enter text here";
        inputBox.style.margin = "0.5rem";
        inputBox.addEventListener("input", function () {
            textBox.innerText = this.value;
        });
        inputBox.onclick = () => {
            updateState(textBox.className);
        };
        // Create a close button for each input box
        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "btn-close";
        closeButton.marginLeft = "0.5rem";
        closeButton.setAttribute("aria-label", "Close");
        closeButton.addEventListener("click", function () {
            textBox.remove();
            container.remove();
        });

        // Append input box and close button to the container
        container.appendChild(inputBox);
        container.appendChild(closeButton);

        // Append the container to the textBoxContainer
        textBoxContainer.appendChild(container);
        // Apply scroll effect
        textBoxContainer.scrollTop = textBoxContainer.scrollHeight;

    }
    function updateState(s) {
        // console.log("updateState" + s);
        selectedTextBox = s;
    }

    function undo() {
        if (currentStateIndex > 0) {
            currentStateIndex--;
            editor.innerHTML = stateStack[currentStateIndex];
        }
    }

    function redo() {
        if (currentStateIndex < stateStack.length - 1) {
            currentStateIndex++;
            editor.innerHTML = stateStack[currentStateIndex];
        }
    }

    function startDrag(e) {
        const textBox = e.target;
        let offsetX = e.clientX - textBox.getBoundingClientRect().left;
        let offsetY = e.clientY - textBox.getBoundingClientRect().top;

        function dragMove(e) {
            textBox.style.left = e.clientX - offsetX + "px";
            textBox.style.top = e.clientY - offsetY + "px";
        }

        function dragEnd() {
            document.removeEventListener("mousemove", dragMove);
            document.removeEventListener("mouseup", dragEnd);
        }

        document.addEventListener("mousemove", dragMove);
        document.addEventListener("mouseup", dragEnd);
    }

    function updateTextProperties(e) {
        const textBox = e.target;
        const fontFamily = document.getElementById("fontFamilyInput").value;
        const fontSize = document.getElementById("fontSizeInput").value;
        const color = document.getElementById("colorInput").value;

        textBox.style.fontFamily = fontFamily;
        textBox.style.fontSize = fontSize + "px";
        textBox.style.color = color;
    }

    function applyTextProperties() {
        // console.log("applyTextProperties" + selectedTextBox);
        // console.log(typeof selectedTextBox);
        const form = document.getElementById("textPropertiesForm");
        const s = document.querySelector(`.${selectedTextBox}`);

        if (s) {
            const fontFamily = form.elements["fontFamily"].value;
            const fontSize = form.elements["fontSize"].value;
            const color = form.elements["color"].value;

            s.style.fontFamily = fontFamily;
            s.style.fontSize = fontSize + "px";
            s.style.color = color;
        }
    }

    // Event listener for the "Make TextBox" button
    const makeTextBoxButton = document.querySelector(".text-botton button");
    makeTextBoxButton.addEventListener("click", addTextBox);

    // Event listener for the "Apply Text Properties" button
    const applyPropertiesButton = document.querySelector("#textPropertiesForm button");
    applyPropertiesButton.addEventListener("click", applyTextProperties);

    // Event listener for the "Undo" button
    const undoButton = document.getElementById("undoButton");
    undoButton.addEventListener("click", undo);

    // Event listener for the "Redo" button
    const redoButton = document.getElementById("redoButton");
    redoButton.addEventListener("click", redo);
});
