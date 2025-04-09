export const getDataAPI = {

    url: new URL('https://dattebayo-api.onrender.com'),
    generalPaths: {
        characters: 'characters',
        clans: 'clans',
        villages: 'villages',
        kekkeiGenkai: 'kekkei-genkai',
        tailedBeasts: 'tailed-beasts',
        teams: 'teams',
        akatsuki: 'akatsuki',
        kara: 'kara',
    },
    
    params: {
        id: 'id',
    },

    config: {
        method: 'GET'
    },

    getAllDataOfCharacters: async () => {
        const response = await fetch(getDataAPI.url + getDataAPI.generalPaths.characters, getDataAPI.config)
        const data = await response.json()
        return data
    }


}

