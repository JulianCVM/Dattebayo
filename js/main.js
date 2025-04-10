/**
 * Importación del módulo API
 * Este módulo contiene las funciones necesarias para interactuar con la API de personajes de Naruto
 */
import { getDataAPI } from '../api/api.js';

/**
 * Variables de estado global para la paginación
 * @type {number} currentPage - Almacena la página actual que se está visualizando
 * @type {number} itemsPerPage - Define cuántos personajes se mostrarán por página
 * @type {number} totalCharacters - Almacena el total de personajes disponibles
 */
let currentPage = 1;
const itemsPerPage = 4;
let totalCharacters = 0;

/**
 * Función asíncrona para obtener y procesar la información de los personajes
 * @param {number} page - Número de página a cargar (por defecto 1)
 * @returns {Promise<Array>} - Retorna un array con los personajes de la página solicitada
 * 
 * Flujo de la función:
 * 1. Obtiene los datos de la API
 * 2. Valida y procesa la estructura de los datos
 * 3. Aplica la paginación
 * 4. Retorna el subconjunto de personajes correspondiente a la página
 */
const informacionPersonajes = async (page = 1) => {
    try {
        // Paso 1: Obtención de datos
        const data = await getDataAPI.getAllDataOfCharacters();
        console.log('Datos recibidos de la API:', data);
        
        // Paso 2: Validación y procesamiento de datos
        if (data && typeof data === 'object') {
            let characters = [];
            // Verificación de diferentes estructuras posibles de los datos
            if (Array.isArray(data.characters)) {
                characters = data.characters;
            } else if (Array.isArray(data)) {
                characters = data;
            } else {
                characters = Object.values(data);
            }
            
            // Paso 3: Aplicación de paginación
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

/**
 * Función para crear la interfaz de paginación
 * @param {number} totalPages - Total de páginas disponibles
 * @returns {HTMLElement} - Retorna el elemento de paginación completo
 * 
 * Estructura de la paginación:
 * - Botón "Anterior"
 * - Números de página
 * - Botón "Siguiente"
 */
function createPagination(totalPages) {
    // Creación del contenedor principal
    const pagination = document.createElement('div');
    pagination.classList.add('pagination');
    
    // Creación del botón Anterior
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    });
    
    // Creación del contenedor de números de página
    const pageNumbers = document.createElement('div');
    pageNumbers.classList.add('page-numbers');
    
    // Generación de botones numéricos
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
    
    // Creación del botón Siguiente
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage();
        }
    });
    
    // Ensamblaje final de la paginación
    pagination.appendChild(prevButton);
    pagination.appendChild(pageNumbers);
    pagination.appendChild(nextButton);
    
    return pagination;
}

/**
 * Función para renderizar los personajes en el DOM
 * @param {Array} characters - Array de personajes a mostrar
 * 
 * Proceso de renderizado:
 * 1. Limpieza del contenedor
 * 2. Validación de datos
 * 3. Creación de elementos para cada personaje
 * 4. Extracción y procesamiento de información
 * 5. Construcción del HTML
 */
function addCharacters(characters) {
    try {
        // Paso 1: Obtención y validación del contenedor
        const card = document.getElementById('card');
        if (!card) {
            console.error('No se encontró el elemento card');
            return;
        }
        
        // Limpieza del contenedor
        card.innerHTML = '';
        
        // Paso 2: Validación de datos
        if (!Array.isArray(characters)) {
            console.error('Los personajes no son un array:', characters);
            return;
        }

        // Paso 3: Procesamiento de cada personaje
        characters.forEach((character, index) => {
            const characterElement = document.createElement('div');
            characterElement.classList.add('character');
            
            // Validación de datos del personaje
            if (!character || typeof character !== 'object') {
                console.error('Personaje inválido:', character);
                return;
            }

            // Extracción de datos básicos
            const name = character.name || 'Nombre desconocido';
            const image = character.images && character.images.length > 0 ? character.images[0] : '';
            
            // Procesamiento de información del clan
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
            
            // Procesamiento de información adicional
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

            // Construcción del HTML del personaje
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

/**
 * Función principal para actualizar la página
 * 
 * Flujo de actualización:
 * 1. Obtiene los personajes de la página actual
 * 2. Actualiza la visualización
 * 3. Actualiza la paginación
 * 4. Actualiza la URL para SEO
 */
async function updatePage() {
    // Paso 1: Obtención de personajes
    const characters = await informacionPersonajes(currentPage);
    
    // Paso 2: Actualización de visualización
    addCharacters(characters);
    
    // Paso 3: Actualización de paginación
    const totalPages = Math.ceil(totalCharacters / itemsPerPage);
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
        paginationContainer.innerHTML = '';
        paginationContainer.appendChild(createPagination(totalPages));
    }
    
    // Paso 4: Actualización de URL
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