const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());


app.use(express.json());
app.use(express.static('dist'));


let persons = [
  {
    id: 1, name: 'Arto Hellas', number: '040-123456'
  },
  {
    id: 2, name: 'Ada Lovelace', number: '040-567890'
  },
  {
    id: 3, name: 'Dan Abramov', number: '040-123456'
  },
  {
    id: 4, name: 'Mary Poppendieck', number: '040-123456'
  }
];

app.get('/api/persons', (req, res)=>{
    res.json(persons)
})
app.get('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id)
    const person = persons.find(n => n.id === id)

    if (person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})
const generateId = () =>{
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}
app.post('/api/persons', (req, res)=>{
    const body = req.body

    if (!body.name || !body.number){
        return res.status(400).json({error: 'name or number is missing'})
    }
    else if (persons.find(n => n.name === body.name)){
        return res.status(400).json({error: 'name must be unique'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
}
)

app.put('/api/persons/:id', (req, res)=>{
    const body = req.body
    const id = Number(req.params.id)
    const person = persons.find(n => n.id === id)

    if (!body.name || !body.number){
        return res.status(400).json({error: 'name or number is missing'})
    }else if (!person){
        return res.status(404).json({error: 'person not found'})
    }
    
    const updatedPerson = {...person, number: body.number}
    persons = persons.map(n => n.id === id ? updatedPerson : n)
    res.json(updatedPerson)
    
})

app.delete('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id)
    const person = persons.find(n => n.id === id)

    if (!person){
        return res.status(404).json({error: 'person not found'})
    }
    
    persons = persons.filter(n => n.id !== id)  //filter returns a new array
    res.status(204).end()
    
})

const  PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})