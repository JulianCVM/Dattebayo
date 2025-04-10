export const getDataAPI = {
    baseUrl: 'https://dattebayo-api.onrender.com',
    generalPaths: {
        characters: '/characters',
        clans: '/clans',
        villages: '/villages',
        kekkeiGenkai: '/kekkei-genkai',
        tailedBeasts: '/tailed-beasts',
        teams: '/teams',
        akatsuki: '/akatsuki',
        kara: '/kara',
    },
    
    params: {
        id: 'id',
    },

    config: {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    },

    getAllDataOfCharacters: async () => {
        try {
            console.log('URL de la API:', `${getDataAPI.baseUrl}${getDataAPI.generalPaths.characters}`);
            const response = await fetch(`${getDataAPI.baseUrl}${getDataAPI.generalPaths.characters}`, getDataAPI.config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("La respuesta no es JSON");
            }
            
            const data = await response.json();
            console.log('Respuesta de la API:', data);
            return data;
        } catch (error) {
            console.error('Error al obtener los personajes:', error);
            throw error;
        }
    }
}


