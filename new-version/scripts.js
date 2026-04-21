let appData = null;

// Carrega os serviços do JSON e renderiza na página
async function loadServices() {
    try {
        const response = await fetch('apps.json');
        appData = await response.json();
        
        const startSection = document.querySelector('start');
        const menuContent = document.querySelector('#menu-content');
        
        // Limpa conteúdo anterior
        startSection.innerHTML = '';
        menuContent.innerHTML = '';
        
        // Separa pinned e não-pinned
        const pinnedServices = appData.services.filter(s => s.pinned);
        const unpinnedServices = appData.services.filter(s => !s.pinned);
        
        // Renderiza serviços pinned na tela inicial
        pinnedServices.forEach(service => {
            const serviceLink = createServiceLink(service);
            startSection.appendChild(serviceLink);
        });
        
        // Renderiza serviços não-pinned no menu
        unpinnedServices.forEach(service => {
            const serviceLink = createServiceLink(service);
            menuContent.appendChild(serviceLink);
        });
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
    }
}

function createServiceLink(service) {
    const serviceLink = document.createElement('a');
    serviceLink.href = service.url;
    serviceLink.textContent = service.name;
    serviceLink.className = 'service-link';
    serviceLink.target = '_blank';
    return serviceLink;
}

// Toggle do menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('open');
}

// Toggle do editor
function toggleEditor() {
    const editorModal = document.getElementById('editor-modal');
    editorModal.classList.toggle('open');
    
    if (editorModal.classList.contains('open')) {
        // Carrega JSON atual no editor
        const editor = document.getElementById('json-editor');
        editor.value = JSON.stringify(appData, null, 2);
    }
}

// Salva o JSON editado
async function saveJSON() {
    const editor = document.getElementById('json-editor');
    try {
        const newData = JSON.parse(editor.value);
        
        // Valida se tem a estrutura básica
        if (!newData.services || !Array.isArray(newData.services)) {
            alert('JSON inválido! Certifique-se de que tem a chave "services" como array.');
            return;
        }
        
        appData = newData;
        
        // Salva no localStorage
        localStorage.setItem('leafoleApps', JSON.stringify(newData));
        
        alert('JSON salvo com sucesso!');
        toggleEditor();
        
        // Recarrega os serviços na interface
        loadServices();
        
    } catch (error) {
        alert('Erro ao salvar JSON: ' + error.message);
    }
}

// Fecha o menu ao clicar em um link
document.addEventListener('click', function(e) {
    if (e.target.matches('.service-link')) {
        const menu = document.getElementById('menu');
        if (menu.classList.contains('open')) {
            menu.classList.remove('open');
        }
    }
});

// Executa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', loadServices);

