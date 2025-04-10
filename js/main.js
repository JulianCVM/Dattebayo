import { getDataAPI } from '../api/api.js';

let currentPage = 1;
const itemsPerPage = 4;
let totalCharacters = 0;

const informacionPersonajes = async (page = 1) => {
    try {
        const data = await getDataAPI.getAllDataOfCharacters();
        console.log('Datos recibidos de la API:', data);
        
        if (data && typeof data === 'object') {
            let characters = [];
            if (Array.isArray(data.characters)) {
                characters = data.characters;
            } else if (Array.isArray(data)) {
                characters = data;
            } else {
                characters = Object.values(data);
            }
            
            totalCharacters = characters.length;
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return characters.slice(startIndex, endIndex);
        }
        return [];
    } catch (error) {
        console.error('Error al obtener los personajes:', error);
        return [];
    }
}

function createPagination(totalPages) {
    const pagination = document.createElement('div');
    pagination.classList.add('pagination');
    
    // Botón Anterior
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    });
    
    // Números de página
    const pageNumbers = document.createElement('div');
    pageNumbers.classList.add('page-numbers');
    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active', i === currentPage);
        pageButton.addEventListener('click', () => {
            currentPage = i;
            updatePage();
        });
        pageNumbers.appendChild(pageButton);
    }
    
    // Botón Siguiente
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage();
        }
    });
    
    pagination.appendChild(prevButton);
    pagination.appendChild(pageNumbers);
    pagination.appendChild(nextButton);
    
    return pagination;
}

function addCharacters(characters) {
    try {
        const card = document.getElementById('card');
        if (!card) {
            console.error('No se encontró el elemento card');
            return;
        }
        
        card.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos personajes
        
        if (!Array.isArray(characters)) {
            console.error('Los personajes no son un array:', characters);
            return;
        }

        characters.forEach((character, index) => {
            const characterElement = document.createElement('div');
            characterElement.classList.add('character');
            
            if (!character || typeof character !== 'object') {
                console.error('Personaje inválido:', character);
                return;
            }

            const name = character.name || 'Nombre desconocido';
            const image = character.images && character.images.length > 0 ? character.images[0] : '';
            
            // Obtener datos alternativos para el clan
            let clanInfo = '';
            let clanLabel = 'Clan';
            if (character.personal?.clan) {
                clanInfo = character.personal.clan;
            } else if (character.clan) {
                clanInfo = character.clan;
            } else if (character.personal?.classification?.[0]) {
                clanInfo = character.personal.classification[0];
                clanLabel = 'Clasificación';
            } else if (character.personal?.occupation?.[0]) {
                clanInfo = character.personal.occupation[0];
                clanLabel = 'Ocupación';
            } else {
                clanInfo = 'Desconocido';
            }
            
            // Obtener datos alternativos para la información adicional
            let additionalInfo = '';
            let additionalLabel = '';
            if (character.natureType?.[0]) {
                additionalInfo = character.natureType[0];
                additionalLabel = 'Tipo de Chakra';
            } else if (character.personal?.kekkeiGenkai?.[0]) {
                additionalInfo = character.personal.kekkeiGenkai[0];
                additionalLabel = 'Kekkei Genkai';
            } else if (character.rank?.ninjaRank?.['Part I']) {
                additionalInfo = character.rank.ninjaRank['Part I'];
                additionalLabel = 'Rango';
            } else if (character.personal?.affiliation?.[0]) {
                additionalInfo = character.personal.affiliation[0];
                additionalLabel = 'Afiliación';
            } else if (character.personal?.tailedBeast) {
                additionalInfo = character.personal.tailedBeast;
                additionalLabel = 'Bestia con Cola';
            } else {
                additionalInfo = 'Desconocido';
                additionalLabel = 'Información';
            }

            characterElement.innerHTML = `
                <img src="${image}" alt="${name} - Personaje de Naruto" loading="lazy">
                <h3>${name}</h3>
                <p>${clanLabel}: ${clanInfo}</p>
                <p>${additionalLabel}: ${additionalInfo}</p>
            `;
            card.appendChild(characterElement);
        });
    } catch (error) {
        console.error('Error al agregar los personajes:', error);
    }
}

async function updatePage() {
    const characters = await informacionPersonajes(currentPage);
    addCharacters(characters);
    
    // Actualizar paginación
    const totalPages = Math.ceil(totalCharacters / itemsPerPage);
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
        paginationContainer.innerHTML = '';
        paginationContainer.appendChild(createPagination(totalPages));
    }
    
    // Actualizar URL para SEO
    const url = new URL(window.location);
    url.searchParams.set('page', currentPage);
    window.history.pushState({}, '', url);
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Obtener página actual de la URL
        const urlParams = new URLSearchParams(window.location.search);
        currentPage = parseInt(urlParams.get('page')) || 1;
        
        // Inicializar la página
        await updatePage();
    } catch (error) {
        console.error('Error al cargar los personajes:', error);
    }
});