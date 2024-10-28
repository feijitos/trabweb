document.addEventListener("DOMContentLoaded", function () {
    // Elementos DOM
    const diaSemana = document.getElementById("dia-semana");
    const dataAtual = document.getElementById("data-atual");
    const horaAtual = document.getElementById("hora-atual");
    const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");
    const dataEscolhida = document.getElementById("data-escolhida");
    const selectRegisterType = document.getElementById("register-type");
    const alertaSucesso = document.getElementById("alerta-ponto-registrado");
    const dialogHora = document.getElementById("dialog-hora");

    // Atualiza os elementos ao carregar
    diaSemana.textContent = getWeekDay();
    dataAtual.textContent = getCurrentDate();
    updateContentHour();

    // Atualiza a hora a cada segundo
    setInterval(updateContentHour, 1000); 

    // Eventos dos botões
    btnRegistrarPonto.addEventListener("click", openDialog);
    document.getElementById("btn-dialog-register").addEventListener("click", registerPoint);
    document.getElementById("dialog-fechar").addEventListener("click", closeDialog);

    function openDialog() {
        const dialogPonto = document.getElementById("dialog-ponto");
        document.getElementById("dialog-data").textContent = "Data: " + getCurrentDate();
        dialogHora.textContent = "Hora: " + getCurrentTime(); 
        dialogPonto.showModal();
    }

    function closeDialog() {
        document.getElementById("dialog-ponto").close();
    }

    async function registerPoint() {
        const register = await getObjectRegister(selectRegisterType.value);
        if (register) { 
            saveRegisterLocalStorage(register);
            showSuccessAlert();
            closeDialog();
            renderReport();  
        }
    }

    function showSuccessAlert() {
        alertaSucesso.classList.remove("hidden");
        alertaSucesso.classList.add("show");
        setTimeout(() => {
            alertaSucesso.classList.remove("show");
            alertaSucesso.classList.add("hidden");
        }, 5000);
    }

    function saveRegisterLocalStorage(register) {
        let registers = JSON.parse(localStorage.getItem("register")) || [];
        registers.push(register);
        localStorage.setItem("register", JSON.stringify(registers));
        localStorage.setItem("lastRegister", JSON.stringify(register));
    }

    async function getObjectRegister(registerType) {
        const dataRegistro = dataEscolhida.value || getCurrentDate();
        if (checkIfFutureDate(dataRegistro)) {
            alert("Não é permitido registrar pontos em datas futuras.");
            return null;
        }

        const justificativa = document.getElementById("justificativa-ausencia").value;
        const arquivo = document.getElementById("upload-arquivo").files[0]?.name || "";
        const observacao = document.getElementById("observacao").value;

        return {
            date: dataRegistro,
            time: getCurrentTime(),
            type: registerType,
            justificativa,
            arquivo,
            observacao,
        };
    }

    function checkIfFutureDate(date) {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        return selectedDate > today;
    }

    function renderReport() {
        const reportContainer = document.getElementById("report-container");
        reportContainer.innerHTML = "";  

        const registers = JSON.parse(localStorage.getItem("register")) || [];
        registers.forEach(register => {
            const registerElement = document.createElement("div");
            registerElement.classList.add("register");
            registerElement.textContent = `Data: ${register.date} | Hora: ${register.time} | Tipo: ${register.type} | Observação: ${register.observacao}`;
            reportContainer.appendChild(registerElement);
        });
    }

    function updateContentHour() {
        horaAtual.textContent = getCurrentTime();
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function getCurrentDate() {
        const now = new Date();
        return now.toLocaleDateString("pt-BR");
    }

    function getWeekDay() {
        const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        return weekdays[new Date().getDay()];
    }

    renderReport(); // Renderiza o relatório inicialmente
});
