const express = require ('express')
const cors = require ('cors')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const app = express()
app.use(express.json())
app.use(cors())

const Filme = mongoose.model ("Filme", mongoose.Schema({
  titulo: {type: String},
  sinopse: {type: String}
}))

const usuarioSchema = mongoose.Schema({
  login: {type: String, required: true, unique: true},
  senha: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

async function conectarMongo() {
  await mongoose.connect('mongodb+srv://pro_mac:machion@cluster0.skf8n.mongodb.net/?retryWrites=true&w=majority')
}

//GET http://localhost:3000/hey
app.get("/hey", (req, res) => {
  res.send("hey");
});

app.get("/filmes", async (req, res) => {
  const filmes = await Filme.find()
  res.json(filmes);
});

app.post("/filmes", async (req, res) => {
  //obtém os dados enviados pelo cliente
  const titulo = req.body.titulo;
  const sinopse = req.body.sinopse;
  //monta um objeto agrupando os dados. Ele representa um novo filme
  //utilizando o modelo para o banco, o Filme
  const filme = new Filme ({ titulo: titulo, sinopse: sinopse });
  //adiciona o novo filme à base construída no banco
  await filme.save()
  //traz a base atualizada
  const filmes = await Filme.find()
  res.json(filmes);
});

app.post('/signup', async(req, res) => {
  try{
    const login = req.body.login
    const senha = req.body.senha
    const senhaCriptografada = await bcrypt.hash(senha, 10)
    const usuario = new Usuario({login: login, senha: senhaCriptografada})
    const respMongo = await usuario.save()
    console.log(respMongo)
    res.status(201).end()
  }
  catch(error) {
    console.log(error)
    res.status(409).end()
  }
})

app.listen(3000, () => {
 try {
  conectarMongo();
  console.log("up, running and connected");
 } 
  catch(e) {
    console.log ("Alguma coisa aconteceu: ", e)
  }
}) 
  