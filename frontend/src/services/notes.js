import axios from 'axios'

const baseUrl = "/api/notes"

function retrieveAll() {
    const nonExisting = {
        id: 10000,
        content: 'This note is not saved to server',
        important: true,
      }
    return axios.get(baseUrl).then(response=>response.data.concat(nonExisting)) 
    
}

function create(newObject) {
    return axios.post(baseUrl, newObject).then(response=>response.data) 
}

function update(id, newObject) {
    return axios.put(`${baseUrl}/${id}`, newObject).then(response=>response.data) 
}

export default { retrieveAll, create, update }